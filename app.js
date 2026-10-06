const app = document.querySelector('#app');
const fallback = {
  name: 'Saugat Pokhrel', role: 'BCA student · curious learner',
  location: 'Sunwal, Lumbini Province, Nepal', email: 'saugatpokhrel069@gmail.com',
  portrait: '/assets/saugat-portrait.jpg',
  intro: 'I’m a first-year BCA student from Sunwal who enjoys learning how things work — from websites and computers to the little details that make a good idea come alive.',
  socials: { discordServer: 'https://discord.gg/WPa9QeYBWS', instagram: 'https://www.instagram.com/known_as_grimmy/', discordProfile: 'https://discord.com/users/1225830906284085329', github: 'https://github.com/Grimmy-01', linkedin: 'https://www.linkedin.com/in/saugatpokhrel' },
  programmingLanguages: ['JavaScript', 'C', 'C++', 'HTML', 'CSS', 'Python'],
  skills: ['HTML', 'CSS', 'JavaScript', 'PHP · basic', 'Responsive web design', 'Photo & video editing', 'Graphic design · basic', 'Computer hardware', 'Basic networking', 'Troubleshooting'],
  hobbies: ['Gaming', 'Music', 'PCs and computer hardware', 'Cooking', 'Pen spinning'],
  education: [], languages: 'Nepali (native) · English (intermediate) · Hindi (intermediate)'
};
let content = { ...fallback };
localStorage.removeItem('saugatPersonalSite');
try { const response = await fetch('/content.json'); if (response.ok) { const saved = await response.json(); content = { ...fallback, ...saved, socials:{ ...fallback.socials, ...saved.socials }, programmingLanguages:saved.programmingLanguages || fallback.programmingLanguages }; } } catch {}
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const page = location.pathname.replace(/\/$/, '') || '/';
const cookieConsentPanel = document.querySelector('#cookie-consent');
const cookieConsentKey = 'saugat_cookie_consent';
const readCookie = name => document.cookie.split('; ').find(value => value.startsWith(`${name}=`))?.split('=').slice(1).join('=') || '';
let cookieChoice = readCookie(cookieConsentKey);
if (!cookieChoice) { try { cookieChoice = localStorage.getItem('saugatCookieConsentV1') || ''; } catch {} }
let essentialCookiesAllowed = cookieChoice === 'accepted';
if (cookieConsentPanel) cookieConsentPanel.hidden = Boolean(cookieChoice);
function saveCookieChoice(choice) {
  cookieChoice = choice;
  essentialCookiesAllowed = choice === 'accepted';
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  try { document.cookie = `${cookieConsentKey}=${choice}; Max-Age=31536000; Path=/; SameSite=Strict${secure}`; } catch {}
  try { localStorage.setItem('saugatCookieConsentV1', choice); } catch {}
  if (cookieConsentPanel) cookieConsentPanel.hidden = true;
}
document.querySelector('#allow-essential-cookies')?.addEventListener('click', () => saveCookieChoice('accepted'));
document.querySelector('#decline-cookies')?.addEventListener('click', () => saveCookieChoice('declined'));
document.querySelector('#cookie-settings')?.addEventListener('click', () => {
  if (cookieConsentPanel) cookieConsentPanel.hidden = false;
  document.querySelector('#allow-essential-cookies')?.focus();
});
document.querySelectorAll('[data-bind="name"]').forEach(n => n.textContent = content.name);
document.querySelectorAll('[data-email]').forEach(n => n.href = `mailto:${content.email}`);
document.querySelector('#year').textContent = new Date().getFullYear();

const header = (num, title, copy) => `<section class="page-top"><div class="kicker">${num} / About me</div><h1>${title}</h1><p>${copy}</p></section>`;
const educationRows = () => content.education.map((e, i) => `<article class="timeline-row reveal" style="--card-index:${i}"><div class="timeline-date">${esc(e.date)}</div><div><h3>${esc(e.title)}</h3><p>${esc(e.place)}</p><p>${esc(e.detail)}</p></div></article>`).join('');
const skillTags = () => content.skills.map((s, i) => `<span class="skill reveal" style="--card-index:${i}">${esc(s)}</span>`).join('');
const hobbyCards = () => content.hobbies.map((h, i) => `<article class="hobby-card reveal" style="--card-index:${i}"><span class="hobby-index">0${i + 1}</span><span class="hobby-symbol">${['遊', '音', '機', '味', '手'][i % 5]}</span><h3>${esc(h)}</h3></article>`).join('');
const languageLogos = {
  javascript: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#F7DF1E" d="M5 5h54v54H5z"/><path fill="#242424" d="M35 43c1 3 3 5 7 5 3 0 5-1 5-3 0-3-2-4-6-5l-2-1c-6-2-9-5-9-11 0-5 4-9 11-9 5 0 9 2 11 7l-6 4c-1-2-2-3-5-3-2 0-4 1-4 3 0 2 2 3 5 5l2 1c7 2 10 5 10 11 0 7-5 10-12 10-7 0-12-3-14-9zm-24 1 7-4c1 3 2 5 5 5 2 0 3-1 3-4V20h8v21c0 9-5 13-12 13-6 0-9-4-11-10Z"/></svg>',
  js: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#F7DF1E" d="M5 5h54v54H5z"/><path fill="#242424" d="M35 43c1 3 3 5 7 5 3 0 5-1 5-3 0-3-2-4-6-5l-2-1c-6-2-9-5-9-11 0-5 4-9 11-9 5 0 9 2 11 7l-6 4c-1-2-2-3-5-3-2 0-4 1-4 3 0 2 2 3 5 5l2 1c7 2 10 5 10 11 0 7-5 10-12 10-7 0-12-3-14-9zm-24 1 7-4c1 3 2 5 5 5 2 0 3-1 3-4V20h8v21c0 9-5 13-12 13-6 0-9-4-11-10Z"/></svg>',
  c: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M51 17c-5-5-11-7-18-7-14 0-24 9-24 22s10 22 24 22c7 0 13-2 18-7" fill="none" stroke="#00599C" stroke-width="9" stroke-linecap="round"/></svg>',
  'c++': '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M43 17c-4-4-9-6-15-6-12 0-21 8-21 20s9 20 21 20c6 0 11-2 15-6" fill="none" stroke="#00599C" stroke-width="8" stroke-linecap="round"/><path d="M44 25h16m-8-8v16m-8 11h16m-8-8v16" stroke="#00599C" stroke-width="4"/></svg>',
  cpp: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M43 17c-4-4-9-6-15-6-12 0-21 8-21 20s9 20 21 20c6 0 11-2 15-6" fill="none" stroke="#00599C" stroke-width="8" stroke-linecap="round"/><path d="M44 25h16m-8-8v16m-8 11h16m-8-8v16" stroke="#00599C" stroke-width="4"/></svg>',
  html: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#E44D26" d="M9 4h46l-4 48-19 8-19-8z"/><path fill="#F16529" d="M32 8h18l-3 40-15 6z"/><path fill="#fff" d="M18 16h29l-1 7H26l1 6h18l-2 16-11 5-12-5-1-9h7l1 4 5 2 5-2 1-5H22z"/></svg>',
  html5: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#E44D26" d="M9 4h46l-4 48-19 8-19-8z"/><path fill="#F16529" d="M32 8h18l-3 40-15 6z"/><path fill="#fff" d="M18 16h29l-1 7H26l1 6h18l-2 16-11 5-12-5-1-9h7l1 4 5 2 5-2 1-5H22z"/></svg>',
  css: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#1572B6" d="M9 4h46l-4.2 48L32 60 13.2 52z"/><path fill="#33A9DC" d="M32 8v47l15-5 3.5-42z"/><text x="32" y="47" fill="#fff" font-family="Arial, sans-serif" font-size="39" font-weight="700" text-anchor="middle">3</text></svg>',
  css3: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#1572B6" d="M9 4h46l-4.2 48L32 60 13.2 52z"/><path fill="#33A9DC" d="M32 8v47l15-5 3.5-42z"/><text x="32" y="47" fill="#fff" font-family="Arial, sans-serif" font-size="39" font-weight="700" text-anchor="middle">3</text></svg>',
  python: '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="#3776AB" d="M31 6c-13 0-13 6-13 6v8h14v3H12S5 22 5 34s7 12 7 12h8v-9s0-8 8-8h14s7 0 7-8V14s1-8-18-8Zm-7 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/><path fill="#FFD343" d="M33 58c13 0 13-6 13-6v-8H32v-3h20s7 1 7-11-7-12-7-12h-8v9s0 8-8 8H22s-7 0-7 8v7s-1 8 18 8Zm7-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>'
};
const languageFallbacks = { php:'PHP', java:'J', typescript:'TS', ts:'TS', rust:'Rs', go:'Go', ruby:'Rb', swift:'Sw', kotlin:'Kt', csharp:'C#', 'c#':'C#', sql:'SQL' };
const programmingCards = () => content.programmingLanguages.map((name, index) => { const key = name.toLowerCase().replace(/\s+/g, ''); const logo = languageLogos[key]; const icon = logo ? logo : esc(languageFallbacks[key] || name.trim().slice(0, 2).toUpperCase()); return `<article class="language-card reveal" style="--card-index:${index}"><span class="language-orbit" aria-hidden="true"></span><span class="language-icon ${logo ? 'language-icon-svg' : ''} lang-${key.replace(/[^a-z0-9]/g,'')}" aria-hidden="true">${icon}</span><h3>${esc(name)}</h3><span class="language-caption">Learning by doing</span></article>`; }).join('');
const socials = [
  ['discordServer','Discord server','Join the community','DC','social-discord'],
  ['instagram','Instagram','Photos & little moments','IG','social-instagram'],
  ['discordProfile','Discord profile','Find me on Discord','@','social-discord'],
  ['github','GitHub','My code corner','GH','social-github'],
  ['linkedin','LinkedIn','Say hello','in','social-linkedin']
];
const socialLogos = {
  discord: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M48.8 15.1A45 45 0 0 0 37.6 11l-1.4 2.9a41 41 0 0 0-8.4 0L26.4 11a45 45 0 0 0-11.2 4.1C8.1 25.2 6.2 35.1 7.2 44.8a45 45 0 0 0 13.7 6.9l3-4.8-4.7-2.3 1.1-.8c9 4.2 18.7 4.2 27.5 0l1.2.8-4.7 2.3 3 4.8a45 45 0 0 0 13.7-6.9c1.2-11.2-1.9-21-8.2-29.7ZM23.5 38.2c-2.7 0-4.8-2.5-4.8-5.5s2.1-5.5 4.8-5.5 4.9 2.5 4.8 5.5-2.1 5.5-4.8 5.5Zm17 0c-2.7 0-4.8-2.5-4.8-5.5s2.1-5.5 4.8-5.5 4.9 2.5 4.8 5.5-2.1 5.5-4.8 5.5Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.7a4.1 4.1 0 0 0-4.1 4.1v8.4a4.1 4.1 0 0 0 4.1 4.1h8.4a4.1 4.1 0 0 0 4.1-4.1V7.8a4.1 4.1 0 0 0-4.1-4.1H7.8ZM12 6.8a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4Zm0 1.7a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.5-2.9a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.5 21.63c.55.1.75-.24.75-.53v-2.08c-3.08.67-3.73-1.31-3.73-1.31-.5-1.28-1.23-1.62-1.23-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.2 3.2.92.1-.71.38-1.2.69-1.48-2.46-.28-5.06-1.24-5.06-5.52 0-1.22.43-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .95-.3 3.1 1.14a10.8 10.8 0 0 1 5.66 0c2.15-1.44 3.1-1.14 3.1-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.29-2.6 5.24-5.08 5.52.4.35.75 1.02.75 2.06V22c0 .29.2.63.76.53A11.1 11.1 0 0 0 12 .9Z"/></svg>',
  linkedin: '<svg viewBox="0 0 64 64" fill="currentColor"><path d="M13 24h9v28h-9zm4.5-13a5.2 5.2 0 1 1 0 10.4 5.2 5.2 0 0 1 0-10.4ZM28 24h9v3.8c1.5-2.5 4.4-4.6 8.8-4.6 9 0 10.7 5.7 10.7 13.2V52h-9V39.5c0-3.1-.1-7.1-4.4-7.1s-5.1 3.4-5.1 6.9V52h-9Z"/></svg>'
};
const socialArrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const socialCards = () => socials.filter(([key]) => content.socials?.[key]).map(([key,label,detail,,kind], i) => { const platform = key.startsWith('discord') ? 'discord' : key; return `<a class="social-card reveal ${kind}" style="--card-index:${i}" href="${esc(content.socials[key])}" target="_blank" rel="noreferrer"><span class="social-icon" aria-hidden="true">${socialLogos[platform]}</span><span class="social-copy"><strong>${label}</strong><small>${detail}</small></span><span class="social-arrow" aria-hidden="true">${socialArrow}</span></a>`; }).join('');

function home() {
  const current = content.education[0] || { title: 'Bachelor of Computer Applications', place: 'Butwal Kalika Campus · Butwal, Nepal', date: '2026 — 2030 expected', detail: 'First-year student learning the foundations of computing.' };
  return `<section class="hero" id="top"><div class="moon" aria-hidden="true"></div>${content.portrait ? `<figure class="hero-portrait reveal"><img src="${esc(content.portrait)}" alt="Portrait of ${esc(content.name)}"><figcaption><span class="seal tiny">SP</span><span>${esc(content.name)} <i>— BCA student</i></span></figcaption></figure>` : ''}<svg class="torii" viewBox="0 0 500 460" fill="none" aria-hidden="true"><path d="M54 60Q250 100 446 60M82 112Q250 145 418 112M140 120V445M360 120V445M80 130H420M120 418H380" stroke="#dc4937" stroke-width="19"/><path d="M157 144V440M343 144V440" stroke="#211a17" stroke-width="11"/></svg><span class="petal" style="left:15%;animation-duration:13s;animation-delay:-3s">✿</span><span class="petal" style="left:69%;animation-duration:17s;animation-delay:-8s">✿</span><span class="petal" style="left:42%;animation-duration:15s;animation-delay:-11s">✿</span><div class="hero-copy"><div class="eyebrow reveal">${esc(content.location)} <span class="red">·</span> ${esc(content.role)}</div><h1 class="reveal">Learning<br>by making<span>学</span></h1><p class="hero-sub reveal">${esc(content.intro)}</p><div class="actions reveal"><a class="btn primary" href="/interests">Explore my world <span>↗</span></a><a class="btn" href="/about">A little about me <span>↓</span></a></div></div><div class="hero-bottom"><p>Student / curious mind / learning<br>Based in Lumbini, Nepal</p><a class="scroll-cue" href="#intro">Scroll to explore <i></i></a></div></section>
  <section class="section" id="intro"><div class="section-header"><span class="index">01</span><h2>A little about me</h2><span class="rule"></span><span class="kicker">私について</span></div><div class="intro-grid"><p class="intro-large reveal">Curious by nature.<br><em>Learning as I go.</em></p><p class="intro-note reveal">${esc(content.intro)} When I’m not studying, I’m usually gaming, listening to music, cooking, or tinkering with PCs.</p></div><div class="stats reveal"><div class="stat"><strong>BCA</strong><span>What I’m studying</span></div><div class="stat"><strong>3</strong><span>Languages I speak</span></div><div class="stat"><strong>${String(content.hobbies.length).padStart(2, '0')}</strong><span>Things I enjoy</span></div></div><p><a class="kicker" href="/about">More about me ↗</a></p></section>
  <section class="section"><div class="section-header"><span class="index">02</span><h2>Where I’m learning</h2><span class="rule"></span><a class="kicker" href="/education">Education ↗</a></div><div class="timeline">${educationRows()}</div></section>
  <section class="section"><div class="section-header"><span class="index">03</span><h2>Code I’m learning</h2><span class="rule"></span><a class="kicker" href="/interests">Skills & hobbies ↗</a></div><div class="language-grid">${programmingCards()}</div><div class="section-header" style="margin-top:92px"><span class="index">04</span><h2>Other skills I’m building</h2><span class="rule"></span></div><div class="skills">${skillTags()}</div></section>
  <section class="section"><div class="section-header"><span class="index">05</span><h2>Outside of class</h2><span class="rule"></span></div><div class="hobby-grid">${hobbyCards()}</div></section>
  <section class="section"><div class="section-header"><span class="index">06</span><h2>Find me around the web</h2><span class="rule"></span></div><div class="social-grid">${socialCards()}</div></section>`;
}

function about() {
  return `${header('01', 'A bit about me', `I’m ${esc(content.name)}, a student from ${esc(content.location)} who likes learning by doing.`)}<section class="section"><div class="intro-grid ${content.portrait ? 'has-photo' : ''}">${content.portrait ? `<figure class="profile-photo reveal"><img src="${esc(content.portrait)}" alt="Portrait of ${esc(content.name)}"><figcaption>${esc(content.name)} <span>· ${esc(content.location)}</span></figcaption></figure>` : ''}<p class="intro-large reveal">A student, a tinkerer,<br><em>and always curious.</em></p><div class="intro-note reveal"><p>${esc(content.intro)}</p><p>I’m currently studying for a Bachelor of Computer Applications at Butwal Kalika Campus. I enjoy exploring websites, computers, and creative tools in my own time.</p><p><strong>Languages</strong><br>${esc(content.languages)}</p></div></div><div class="section-header" style="margin-top:100px"><span class="index">01</span><h2>What matters to me</h2><span class="rule"></span></div><div class="hobby-grid"><article class="hobby-card reveal"><span class="hobby-index">01</span><span class="hobby-symbol">好</span><h3>Stay curious</h3><p>I like figuring out how digital things are made and learning a little more each day.</p></article><article class="hobby-card reveal"><span class="hobby-index">02</span><span class="hobby-symbol">作</span><h3>Make things</h3><p>From small web ideas to exploring creative tools, I learn best by trying things out.</p></article><article class="hobby-card reveal"><span class="hobby-index">03</span><span class="hobby-symbol">人</span><h3>Keep it human</h3><p>I value friendly communication, patience, and making room for new ideas.</p></article></div></section>`;
}

function educationPage() {
  return `${header('02', 'My education', 'What I’m studying, the subjects I’m exploring, and a milestone I’m proud of.') }<section class="section"><div class="timeline">${educationRows()}</div><div class="section-header" style="margin-top:100px"><span class="index">✳</span><h2>What I’m learning now</h2><span class="rule"></span></div><p class="intro-note reveal">Programming in C, mathematics, digital logic, computer hardware, communication, and the fundamentals that make computers work.</p><div class="stat reveal" style="margin-top:50px"><strong>2nd place</strong><span>Inter-school front-end web development competition · 2025</span></div></section>`;
}

function interests() {
  return `${header('03', 'Skills & hobbies', 'A mix of things I’m practicing and the interests I return to when I have free time.')}<section class="section"><div class="section-header"><span class="index">01</span><h2>Code I’m learning</h2><span class="rule"></span></div><div class="language-grid">${programmingCards()}</div><div class="section-header" style="margin-top:105px"><span class="index">02</span><h2>Other skills</h2><span class="rule"></span></div><div class="skills">${skillTags()}</div><div class="section-header" style="margin-top:105px"><span class="index">03</span><h2>What I enjoy</h2><span class="rule"></span></div><div class="hobby-grid">${hobbyCards()}</div><div class="section-header" style="margin-top:105px"><span class="index">04</span><h2>Languages I speak</h2><span class="rule"></span></div><p class="intro-large reveal">${esc(content.languages)}</p></section>`;
}

function contact() {
  return `${header('04', 'Say hello', 'Want to chat about learning web development, computers, games, music, or something else? Send me a note.') }<section class="section"><div class="contact-grid"><div class="contact-info reveal"><div class="kicker">Find me around the web</div><a href="mailto:${esc(content.email)}"><span>Email</span>${esc(content.email)} ↗</a><div class="social-grid contact-socials">${socialCards()}</div><p class="form-note">${esc(content.location)}</p></div><form class="contact-form reveal" id="contact-form"><div class="field"><label for="sender">Your name</label><input id="sender" name="name" required maxlength="100" autocomplete="name" placeholder="Name"></div><div class="field"><label for="reply">Your email</label><input id="reply" name="email" type="email" required maxlength="200" autocomplete="email" placeholder="you@example.com"></div><div class="field"><label for="message">Message</label><textarea id="message" name="message" required maxlength="5000" placeholder="Write me a note…"></textarea></div><label class="trap" aria-hidden="true">Leave this blank<input name="website" tabindex="-1" autocomplete="off"></label><button class="btn primary" type="submit">Send note <span>↗</span></button><p class="form-note" id="form-status" aria-live="polite">Your message will be sent to ${esc(content.email)}.</p></form></div></section>`;
}

function adminLogin() {
  return `${header('05', 'Admin sign in', 'The edit controls are private. Sign in to update your story and what appears across the site.')}<section class="section"><form class="admin-login editor-card reveal" id="admin-login"><span class="login-mark">鍵</span><label for="admin-email">Admin email</label><input id="admin-email" name="email" type="email" autocomplete="username" required><label for="admin-password">Password</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required><button class="btn primary" type="submit">Unlock my site <span>↗</span></button><p class="form-note" id="login-status" aria-live="polite">Only the site owner can edit these details.</p></form></section>`;
}

function editor() {
  return `${header('05', 'My site studio', 'Update your details, interests, links, and the code you’re learning. Changes are saved to the site.')}<section class="section"><div class="editor-shell"><div class="editor-card"><div class="kicker">Your details</div><div class="editor-grid" id="editor-fields"></div><p class="editor-hint">Lists: one item per line. Education: JSON. Programming language cards assign a built-in icon or a matching monogram automatically.</p><div class="photo-editor"><img id="profile-preview" alt="Profile photo preview" hidden><div><label for="profile-upload">Profile photo</label><input type="file" id="profile-upload" accept="image/*"><p class="editor-hint">Photo is saved with your site content.</p></div><button class="btn" id="remove-profile" type="button">Remove photo</button></div><div class="editor-actions"><button class="btn primary" id="save-content">Save changes</button><button class="btn" id="export-content">Export content.json</button><label class="btn" for="import-content">Import JSON</label><input id="import-content" type="file" accept="application/json,.json" hidden><button class="btn" id="logout-admin" type="button">Sign out</button></div><p class="editor-hint" id="editor-status" aria-live="polite"></p></div></div></section>`;
}

const routes = { '/': home, '/about': about, '/education': educationPage, '/work': educationPage, '/interests': interests, '/contact': contact, '/edit': adminLogin };
app.innerHTML = (routes[page] || home)();
const siteLoader = document.querySelector('#site-loader');
if (siteLoader) {
  setTimeout(() => siteLoader.classList.add('is-opening'), 50);
  setTimeout(() => siteLoader.classList.add('is-gone'), 1300);
  setTimeout(() => siteLoader.remove(), 1500);
}
const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(e => observer.observe(e));
const topbar = document.querySelector('.topbar'), progress = document.querySelector('.scroll-progress');
let motionFrame = 0;
const updateMotion = () => {
  motionFrame = 0;
  const y = scrollY;
  topbar.classList.toggle('scrolled', y > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? y / max * 100 : 0}%`;
  document.documentElement.style.setProperty('--scroll-y', `${y}px`);
  const hero = document.querySelector('.hero');
  if (hero) hero.style.setProperty('--hero-scroll', `${Math.min(y, innerHeight) * .22}px`);
};
addEventListener('scroll', () => { if (!motionFrame) motionFrame = requestAnimationFrame(updateMotion); }, { passive: true });
updateMotion();
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5) * 2;
    const y = (e.clientY / innerHeight - .5) * 2;
    document.documentElement.style.setProperty('--pointer-x', `${x.toFixed(2)}`);
    document.documentElement.style.setProperty('--pointer-y', `${y.toFixed(2)}`);
  }, { passive: true });
}
const toggle = document.querySelector('.menu-toggle'), nav = document.querySelector('.nav');
const setNavigationOpen = open => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  nav.classList.toggle('open', open);
};
toggle.addEventListener('click', () => setNavigationOpen(toggle.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNavigationOpen(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setNavigationOpen(false); toggle.focus(); } });
addEventListener('resize', () => { if (innerWidth > 1180 && toggle.getAttribute('aria-expanded') === 'true') setNavigationOpen(false); }, { passive: true });

const themeRope = document.querySelector('#theme-rope');
let siteTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
const applyTheme = theme => {
  siteTheme = theme;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#eee8dc' : '#090b0b';
  themeRope.setAttribute('aria-pressed', String(theme === 'light'));
  themeRope.setAttribute('aria-label', `Pull the rope to switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
  try { localStorage.setItem('saugatThemeV2', theme); } catch {}
};
applyTheme(siteTheme);
const pullThemeRope = () => applyTheme(siteTheme === 'dark' ? 'light' : 'dark');
let ropePointer = null, ropeStart = 0, ropePull = 0, ropeKeyboardPull = false;
themeRope.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  event.preventDefault(); ropePointer = event.pointerId; ropeStart = event.clientY; ropePull = 0;
  themeRope.classList.add('is-pulling');
  try { themeRope.setPointerCapture(event.pointerId); } catch {}
});
document.addEventListener('pointermove', event => {
  if (event.pointerId !== ropePointer) return;
  ropePull = Math.max(0, Math.min(110, event.clientY - ropeStart));
  themeRope.style.setProperty('--rope-pull', `${ropePull}px`);
  themeRope.style.setProperty('--rope-angle', `${Math.min(ropePull * .12, 9)}deg`);
}, { passive: true });
const resetRope = () => {
  ropePointer = null; ropeKeyboardPull = false; themeRope.classList.remove('is-pulling');
  themeRope.style.setProperty('--rope-pull', '0px'); themeRope.style.setProperty('--rope-angle', '0deg');
};
const releaseRope = event => {
  if (event.pointerId !== ropePointer) return;
  if (ropePull > 24) pullThemeRope();
  resetRope();
};
document.addEventListener('pointerup', releaseRope);
document.addEventListener('pointercancel', event => { if (event.pointerId === ropePointer) resetRope(); });
themeRope.addEventListener('click', event => event.preventDefault());
themeRope.addEventListener('keydown', event => {
  if (![' ', 'ArrowDown'].includes(event.key) || ropeKeyboardPull) return;
  event.preventDefault(); ropeKeyboardPull = true; themeRope.classList.add('is-pulling');
  themeRope.style.setProperty('--rope-pull', '38px');
});
themeRope.addEventListener('keyup', event => {
  if (!ropeKeyboardPull || ![' ', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault(); pullThemeRope(); resetRope();
});
themeRope.addEventListener('blur', resetRope);

// Use the owner's audio files. Button sounds start enabled; the visitor can turn them off.
let soundsOn = true;
try { soundsOn = localStorage.getItem('saugatSoundEnabledV2') !== 'false'; } catch {}
const soundToggle = document.querySelector('#sound-toggle');
const openingAudio = document.querySelector('#opening-audio');
const buttonAudio = document.querySelector('#button-audio');
const openingSoundPrompt = document.querySelector('#opening-sound-prompt');
openingAudio.volume = .72;
buttonAudio.volume = .55;
function playAudio(audio, force = false) {
  if ((!soundsOn && !force) || !audio) return;
  try { audio.pause(); audio.currentTime = 0; audio.play().catch(() => {}); } catch {}
}
function stopSounds() { openingAudio.pause(); buttonAudio.pause(); }
const syncSoundToggle = () => {
  if (!soundToggle) return;
  soundToggle.setAttribute('aria-pressed', String(soundsOn));
  soundToggle.setAttribute('aria-label', soundsOn ? 'Turn button sounds off' : 'Turn button sounds on');
  soundToggle.querySelector('.sound-state').textContent = soundsOn ? 'Button sounds on' : 'Button sounds off';
};
// Attempt the opening track on every page load. Browsers may block autoplay.
try {
  openingAudio.currentTime = 0;
  openingAudio.play().catch(() => { if (openingSoundPrompt) openingSoundPrompt.hidden = false; });
} catch {}
openingSoundPrompt?.addEventListener('click', () => {
  openingAudio.currentTime = 0;
  openingAudio.play().then(() => { openingSoundPrompt.hidden = true; }).catch(() => {});
});
syncSoundToggle();
soundToggle?.addEventListener('click', () => {
  soundsOn = !soundsOn;
  try { localStorage.setItem('saugatSoundEnabledV2', String(soundsOn)); } catch {}
  syncSoundToggle();
  if (!soundsOn) stopSounds();
});
document.addEventListener('pointerover', event => {
  const target = event.target.closest('button,.btn,.nav a');
  if (!target || target === openingSoundPrompt || event.relatedTarget?.closest('button,.btn,.nav a') === target) return;
  playAudio(buttonAudio);
}, { passive: true });

if (page === '/edit') setupAdmin();
if (page === '/contact') {
  const contactStatus = document.querySelector('#form-status');
  fetch('/api/contact/status').then(r => r.json()).then(state => { if (!state.configured) contactStatus.textContent = `Messages are addressed to ${content.email}; email delivery needs server setup. You can email me directly above.`; }).catch(() => {});
  document.querySelector('#contact-form').addEventListener('submit', async e => {
    e.preventDefault(); const form = e.currentTarget, button = form.querySelector('button[type=submit]'); button.disabled = true; contactStatus.textContent = 'Sending…';
    try { const res = await fetch('/api/contact', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify(Object.fromEntries(new FormData(form))) }); const data = await res.json(); if (!res.ok) throw Error(data.error || 'Message could not be sent.'); form.reset(); contactStatus.textContent = 'Your note has been sent. Thank you.'; }
    catch (error) { contactStatus.textContent = `${error.message} You can email ${content.email} directly.`; }
    finally { button.disabled = false; }
  });
}

function setupAdmin() {
  const form = document.querySelector('#admin-login');
  const openEditor = () => { app.innerHTML = editor(); setupEditor(); };
  const status = document.querySelector('#login-status');
  if (!essentialCookiesAllowed) status.textContent = 'Allow the essential sign-in cookie in Cookie settings to use the private editor.';
  else fetch('/api/admin/session').then(r => r.json()).then(result => { if (result.authenticated) openEditor(); }).catch(() => {});
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!essentialCookiesAllowed) { status.textContent = 'Please allow essential cookies in Cookie settings before signing in.'; return; }
    const button = form.querySelector('button'); button.disabled = true; status.textContent = 'Checking…';
    try {
      const response = await fetch('/api/admin/session', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ email:form.email.value, password:form.password.value }) });
      let result;
      try { result = await response.json(); }
      catch { throw new Error('The admin sign-in service is unavailable on this host. This site needs its Node.js server or a PHP admin backend.'); }
      if (!response.ok) throw new Error(result.error || 'Could not sign in.');
      openEditor();
    } catch (error) { status.textContent = error.message; }
    finally { button.disabled = false; }
  });
}

function setupEditor() {
  const fields = document.querySelector('#editor-fields');
  const values = { name:content.name, role:content.role, location:content.location, intro:content.intro, programmingLanguages:(content.programmingLanguages || []).join('\n'), skills:content.skills.join('\n'), hobbies:content.hobbies.join('\n'), education:JSON.stringify(content.education, null, 2), languages:content.languages, 'socials.discordServer':content.socials.discordServer, 'socials.instagram':content.socials.instagram, 'socials.discordProfile':content.socials.discordProfile, 'socials.github':content.socials.github, 'socials.linkedin':content.socials.linkedin };
  const multi = new Set(['intro', 'programmingLanguages', 'skills', 'hobbies', 'education']);
  fields.innerHTML = Object.entries(values).map(([k, v]) => `<div class="field"><label for="edit-${k.replace(/[^a-z0-9]/gi,'-')}">${esc(k.startsWith('socials.') ? k.slice(8) : k)}</label>${multi.has(k) ? `<textarea id="edit-${k.replace(/[^a-z0-9]/gi,'-')}" data-key="${k}">${esc(v)}</textarea>` : `<input id="edit-${k.replace(/[^a-z0-9]/gi,'-')}" data-key="${k}" value="${esc(v)}">`}</div>`).join('');
  const photo = document.querySelector('#profile-upload'), preview = document.querySelector('#profile-preview');
  if (content.portrait) { preview.src = content.portrait; preview.hidden = false; }
  photo.onchange = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { document.querySelector('#editor-status').textContent = 'Choose an image file.'; return; }
    const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
    const image = new Image(); image.src = data; await image.decode(); const canvas = document.createElement('canvas'), size = 900, scale = Math.min(1, size / Math.max(image.width, image.height)); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale); canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    content.portrait = canvas.toDataURL('image/jpeg', .84); preview.src = content.portrait; preview.hidden = false; document.querySelector('#editor-status').textContent = 'Photo ready. Save changes to update the site.';
  };
  document.querySelector('#remove-profile').onclick = () => { content.portrait = ''; preview.removeAttribute('src'); preview.hidden = true; document.querySelector('#editor-status').textContent = 'Photo removed from the draft. Save changes to update the site.'; };
  document.querySelector('#save-content').onclick = async () => {
    const status = document.querySelector('#editor-status'), button = document.querySelector('#save-content'); button.disabled = true; status.textContent = 'Saving…';
    try {
      const next = { ...content, socials:{ ...content.socials } };
      fields.querySelectorAll('[data-key]').forEach(el => {
        const k = el.dataset.key;
        if (k.startsWith('socials.')) next.socials[k.slice(8)] = el.value.trim();
        else if (['skills','hobbies','programmingLanguages'].includes(k)) next[k] = el.value.split('\n').map(x => x.trim()).filter(Boolean);
        else if (k === 'education') next[k] = JSON.parse(el.value);
        else next[k] = el.value.trim();
      });
      const response = await fetch('/api/content', { method:'PUT', headers:{ 'content-type':'application/json' }, body:JSON.stringify(next) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Could not save changes.');
      content = { ...fallback, ...result.content, socials:{ ...fallback.socials, ...result.content.socials } };
      localStorage.removeItem('saugatPersonalSite');
      document.querySelectorAll('[data-bind="name"]').forEach(n => n.textContent = content.name);
      status.textContent = 'Saved to the site. Visitors will see the updated details.';
    } catch (error) { status.textContent = `Could not save: ${error.message}`; }
    finally { button.disabled = false; }
  };
  document.querySelector('#export-content').onclick = () => download(JSON.stringify(content, null, 2), 'content.json', 'application/json');
  document.querySelector('#logout-admin').onclick = async () => { await fetch('/api/admin/session', { method:'DELETE' }); location.reload(); };
  document.querySelector('#import-content').onchange = async e => {
    try {
      const x = JSON.parse(await e.target.files[0].text());
      if (!x.name || !Array.isArray(x.education) || !Array.isArray(x.skills) || !Array.isArray(x.hobbies) || !Array.isArray(x.programmingLanguages)) throw Error('This does not look like the personal site content file.');
      content = { ...fallback, ...x, email:fallback.email, socials:{ ...fallback.socials, ...x.socials } };
      fields.querySelectorAll('[data-key]').forEach(el => { const k = el.dataset.key, value = k.startsWith('socials.') ? content.socials[k.slice(8)] : content[k]; el.value = Array.isArray(value) ? value.join('\n') : k === 'education' ? JSON.stringify(value, null, 2) : value ?? ''; });
      if (content.portrait) { preview.src = content.portrait; preview.hidden = false; } else { preview.removeAttribute('src'); preview.hidden = true; }
      document.querySelector('#editor-status').textContent = 'Imported into the draft. Save changes to publish it.';
    }
    catch (err) { document.querySelector('#editor-status').textContent = `Import failed: ${err.message}`; }
  };
}
function download(text, name, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
