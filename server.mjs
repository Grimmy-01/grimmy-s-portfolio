import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mp3':'audio/mpeg' };
const sessions = new Map(), attempts = new Map(), SESSION_MS = 12 * 60 * 60 * 1000;
const env = async key => {
  if (process.env[key]) return process.env[key];
  try { const text = await readFile(join(root, '.env'), 'utf8'); const line = text.split(/\r?\n/).map(x => x.trim()).find(x => x.startsWith(`${key}=`)); return line?.slice(key.length + 1).replace(/^['"]|['"]$/g, ''); }
  catch { return undefined; }
};
const send = (res, status, data, headers = {}) => { res.writeHead(status, { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store', ...headers }); res.end(JSON.stringify(data)); };
async function readBody(req, limit = 12000) {
  let body = ''; for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > limit) throw Object.assign(new Error('Request is too large.'), { status:413 }); }
  try { return JSON.parse(body); } catch { throw Object.assign(new Error('Invalid request.'), { status:400 }); }
}
function secureEqual(left, right) {
  const a = Buffer.from(String(left ?? '')), b = Buffer.from(String(right ?? ''));
  return a.length === b.length && timingSafeEqual(a, b);
}
function sessionFor(req) {
  const cookie = req.headers.cookie || '', token = cookie.match(/(?:^|;\s*)saugat_admin=([a-f0-9]+)/)?.[1];
  const expires = token && sessions.get(token);
  if (!expires || expires < Date.now()) { if (token) sessions.delete(token); return null; }
  return token;
}
function ownerOnly(req, res) { if (sessionFor(req)) return true; send(res, 401, { error:'Please sign in to edit this site.' }); return false; }
function cleanContent(data) {
  if (!data || typeof data !== 'object' || !data.name || !Array.isArray(data.education) || !Array.isArray(data.skills) || !Array.isArray(data.hobbies) || !Array.isArray(data.programmingLanguages)) throw Object.assign(new Error('Please include your name, education, skills, hobbies, and programming languages.'), { status:400 });
  const next = { ...data, email:'saugatpokhrel069@gmail.com' };
  for (const key of ['skills','hobbies','programmingLanguages']) {
    if (next[key].length > 100 || next[key].some(x => typeof x !== 'string' || x.length > 100)) throw Object.assign(new Error(`The ${key} list has an invalid item.`), { status:400 });
  }
  if (next.education.length > 30 || next.education.some(x => !x || typeof x !== 'object' || Object.values(x).some(v => typeof v !== 'string' || v.length > 3000))) throw Object.assign(new Error('The education list is invalid.'), { status:400 });
  const socials = next.socials && typeof next.socials === 'object' ? next.socials : {};
  for (const value of Object.values(socials)) if (value && (typeof value !== 'string' || !/^https:\/\//i.test(value))) throw Object.assign(new Error('Social links must use https:// URLs.'), { status:400 });
  if (next.portrait && typeof next.portrait === 'string' && next.portrait.startsWith('data:') && next.portrait.length > 3_500_000) throw Object.assign(new Error('That profile image is too large.'), { status:413 });
  return next;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/admin/session' && req.method === 'GET') return send(res, 200, { authenticated:!!sessionFor(req) });
  if (url.pathname === '/api/admin/session' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'local', now = Date.now(), prior = attempts.get(ip);
    if (prior && prior.until > now && prior.count >= 8) return send(res, 429, { error:'Too many tries. Wait 15 minutes and try again.' });
    try {
      const body = await readBody(req, 2048), email = await env('ADMIN_EMAIL'), password = await env('ADMIN_PASSWORD');
      if (!email || !password) return send(res, 503, { error:'Admin access needs server settings. Add ADMIN_EMAIL and ADMIN_PASSWORD to the private .env file.' });
      const valid = secureEqual(body.email?.trim().toLowerCase(), email.trim().toLowerCase()) && secureEqual(body.password, password);
      if (!valid) { const entry = prior && prior.until > now ? prior : { count:0, until:now + 15 * 60 * 1000 }; entry.count++; attempts.set(ip, entry); return send(res, 401, { error:'That sign-in did not match. Check your details and try again.' }); }
      attempts.delete(ip);
      const token = randomBytes(32).toString('hex'); sessions.set(token, Date.now() + SESSION_MS);
      const secure = req.socket.encrypted ? '; Secure' : '';
      return send(res, 200, { authenticated:true }, { 'set-cookie':`saugat_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1000}${secure}` });
    } catch (error) { return send(res, error.status || 400, { error:error.message }); }
  }
  if (url.pathname === '/api/admin/session' && req.method === 'DELETE') {
    const token = sessionFor(req); if (token) sessions.delete(token);
    return send(res, 200, { authenticated:false }, { 'set-cookie':'saugat_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
  }
  if (url.pathname === '/api/content' && req.method === 'PUT') {
    if (!ownerOnly(req, res)) return;
    try {
      const content = cleanContent(await readBody(req, 4_000_000));
      await writeFile(join(root, 'content.json'), `${JSON.stringify(content, null, 2)}\n`, 'utf8');
      return send(res, 200, { ok:true, content });
    } catch (error) { return send(res, error.status || 400, { error:error.message }); }
  }
  if (url.pathname === '/api/contact/status' && req.method === 'GET') {
    return send(res, 200, { configured:!!(await env('RESEND_API_KEY') && await env('RESEND_FROM_EMAIL')) });
  }
  if (req.method === 'POST' && url.pathname === '/api/contact') {
    try {
      const data = await readBody(req, 12000);
      if (data.website) return send(res, 200, { ok:true });
      const name = String(data.name || '').trim(), email = String(data.email || '').trim(), message = String(data.message || '').trim();
      if (name.length < 1 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || message.length < 5 || message.length > 5000) return send(res, 400, { error:'Please check your name, email, and message.' });
      const key = await env('RESEND_API_KEY'), from = await env('RESEND_FROM_EMAIL');
      if (!key || !from) return send(res, 503, { error:'Email delivery is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL to .env.' });
      const sent = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ authorization:`Bearer ${key}`, 'content-type':'application/json' }, body:JSON.stringify({ from, to:['saugatpokhrel069@gmail.com'], reply_to:email, subject:`Portfolio message from ${name}`, text:`From: ${name}\nReply to: ${email}\n\n${message}` }) });
      if (!sent.ok) { console.error('Resend rejected message:', sent.status); return send(res, 502, { error:'The email service could not deliver this message. Please try emailing directly.' }); }
      return send(res, 200, { ok:true });
    } catch (error) { return send(res, error.status || 400, { error:error.message || 'Invalid message request.' }); }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end(); return; }
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.split('/').some(part => part.startsWith('.') && part.length > 1)) { res.writeHead(404, { 'content-type':'text/plain; charset=utf-8' }).end('Not found'); return; }
  if (pathname === '/source' || pathname.startsWith('/source/')) { res.writeHead(404, { 'content-type':'text/plain; charset=utf-8' }).end('Not found'); return; }
  if (['/', '/about', '/education', '/work', '/interests', '/contact', '/edit'].includes(pathname)) {
    try { const bytes = await readFile(join(root, 'index.html')); res.writeHead(200, { 'content-type':mime['.html'], 'cache-control':'no-cache' }); res.end(req.method === 'HEAD' ? undefined : bytes); }
    catch { res.writeHead(500).end('Site unavailable'); }
    return;
  }
  const clean = normalize(pathname).replace(/^[/\\]+/, ''), target = resolve(root, clean);
  if (target !== root && !target.startsWith(root + sep)) { res.writeHead(403).end('Forbidden'); return; }
  try { const bytes = await readFile(target); res.writeHead(200, { 'content-type':mime[extname(target)] || 'application/octet-stream', 'cache-control':'no-cache' }); res.end(req.method === 'HEAD' ? undefined : bytes); }
  catch { res.writeHead(404, { 'content-type':'text/plain; charset=utf-8' }).end('Not found'); }
});

const port = Number(process.env.PORT) || 4173;
server.listen(port, '127.0.0.1', () => console.log(`Saugat portfolio ready at http://localhost:${port}`));
