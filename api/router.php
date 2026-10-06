<?php
declare(strict_types=1);

$siteRoot = dirname(__DIR__);

function reply_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function site_setting(string $key): ?string
{
    $value = getenv($key);
    if ($value !== false && $value !== '') return $value;

    global $siteRoot;
    $envFile = $siteRoot . DIRECTORY_SEPARATOR . '.env';
    if (!is_file($envFile) || !is_readable($envFile)) return null;
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
        [$name, $entry] = explode('=', $line, 2);
        if (trim($name) !== $key) continue;
        $entry = trim($entry);
        if (strlen($entry) >= 2 && (($entry[0] === '"' && substr($entry, -1) === '"') || ($entry[0] === "'" && substr($entry, -1) === "'"))) {
            $entry = substr($entry, 1, -1);
        }
        return $entry;
    }
    return null;
}

function request_json(int $limit): array
{
    $body = file_get_contents('php://input', false, null, 0, $limit + 1);
    if ($body === false || strlen($body) > $limit) reply_json(413, ['error' => 'Request is too large.']);
    $data = json_decode($body, true);
    if (!is_array($data)) reply_json(400, ['error' => 'Invalid request.']);
    return $data;
}

function start_admin_session(): void
{
    $secure = (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    ini_set('session.gc_maxlifetime', '43200');
    session_name('saugat_admin');
    session_set_cookie_params([
        'lifetime' => 43200,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
}

function attempts_file(): ?string
{
    global $siteRoot;
    $directory = $siteRoot . DIRECTORY_SEPARATOR . 'private';
    if (!is_dir($directory) && !@mkdir($directory, 0755, true) && !is_dir($directory)) return null;
    return $directory . DIRECTORY_SEPARATOR . 'login-attempts.json';
}

function rate_limited(): bool
{
    $path = attempts_file();
    if ($path === null || !($handle = @fopen($path, 'c+'))) return false;
    flock($handle, LOCK_EX);
    $stored = json_decode(stream_get_contents($handle) ?: '{}', true);
    $key = hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $entry = is_array($stored) ? ($stored[$key] ?? null) : null;
    $blocked = is_array($entry) && ($entry['until'] ?? 0) > time() && ($entry['count'] ?? 0) >= 8;
    flock($handle, LOCK_UN);
    fclose($handle);
    return $blocked;
}

function record_login_failure(bool $success): void
{
    $path = attempts_file();
    if ($path === null || !($handle = @fopen($path, 'c+'))) return;
    flock($handle, LOCK_EX);
    $stored = json_decode(stream_get_contents($handle) ?: '{}', true);
    if (!is_array($stored)) $stored = [];
    $key = hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    if ($success) {
        unset($stored[$key]);
    } else {
        $entry = $stored[$key] ?? ['count' => 0, 'until' => time() + 900];
        if (($entry['until'] ?? 0) <= time()) $entry = ['count' => 0, 'until' => time() + 900];
        $entry['count'] = ($entry['count'] ?? 0) + 1;
        $stored[$key] = $entry;
    }
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($stored));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function require_admin(): void
{
    start_admin_session();
    if (($_SESSION['expires_at'] ?? 0) < time()) unset($_SESSION['admin_authenticated'], $_SESSION['expires_at']);
    if (($_SESSION['admin_authenticated'] ?? false) !== true) reply_json(401, ['error' => 'Please sign in to edit this site.']);
}

function handle_session(string $method): void
{
    start_admin_session();
    if (($_SESSION['expires_at'] ?? 0) < time()) {
        unset($_SESSION['admin_authenticated'], $_SESSION['expires_at']);
    }
    if ($method === 'GET') reply_json(200, ['authenticated' => ($_SESSION['admin_authenticated'] ?? false) === true]);
    if ($method === 'DELETE') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', ['expires' => time() - 42000, 'path' => $params['path'], 'secure' => $params['secure'], 'httponly' => true, 'samesite' => 'Strict']);
        }
        session_destroy();
        reply_json(200, ['authenticated' => false]);
    }
    if ($method !== 'POST') reply_json(405, ['error' => 'Method not allowed.']);
    if (rate_limited()) reply_json(429, ['error' => 'Too many tries. Wait 15 minutes and try again.']);

    $email = site_setting('ADMIN_EMAIL');
    $password = site_setting('ADMIN_PASSWORD');
    if (!$email || !$password) reply_json(503, ['error' => 'Admin access needs ADMIN_EMAIL and ADMIN_PASSWORD in the private .env file.']);
    $body = request_json(2048);
    $providedEmail = strtolower(trim((string) ($body['email'] ?? '')));
    $providedPassword = (string) ($body['password'] ?? '');
    $valid = hash_equals(strtolower(trim($email)), $providedEmail) && hash_equals($password, $providedPassword);
    record_login_failure($valid);
    if (!$valid) reply_json(401, ['error' => 'That sign-in did not match. Check your details and try again.']);
    session_regenerate_id(true);
    $_SESSION['admin_authenticated'] = true;
    $_SESSION['expires_at'] = time() + 43200;
    reply_json(200, ['authenticated' => true]);
}

function handle_content(string $method): void
{
    if ($method !== 'PUT') reply_json(405, ['error' => 'Method not allowed.']);
    require_admin();
    global $siteRoot;
    $next = request_json(4000000);
    foreach (['education', 'skills', 'hobbies', 'programmingLanguages'] as $key) {
        if (!isset($next[$key]) || !is_array($next[$key])) reply_json(400, ['error' => 'Please include your name, education, skills, hobbies, and programming languages.']);
    }
    if (empty($next['name']) || !is_string($next['name'])) reply_json(400, ['error' => 'Please include your name.']);
    foreach (['skills', 'hobbies', 'programmingLanguages'] as $key) {
        if (count($next[$key]) > 100) reply_json(400, ['error' => "The $key list has too many items."]);
        foreach ($next[$key] as $item) if (!is_string($item) || strlen($item) > 100) reply_json(400, ['error' => "The $key list has an invalid item."]);
    }
    if (count($next['education']) > 30) reply_json(400, ['error' => 'The education list has too many entries.']);
    foreach ($next['education'] as $item) {
        if (!is_array($item)) reply_json(400, ['error' => 'The education list is invalid.']);
        foreach ($item as $value) if (!is_string($value) || strlen($value) > 3000) reply_json(400, ['error' => 'The education list is invalid.']);
    }
    $socials = isset($next['socials']) && is_array($next['socials']) ? $next['socials'] : [];
    foreach ($socials as $url) if ($url !== '' && (!is_string($url) || !preg_match('#^https://#i', $url))) reply_json(400, ['error' => 'Social links must use https:// URLs.']);
    $next['email'] = 'saugatpokhrel069@gmail.com';
    $encoded = json_encode($next, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($encoded === false) reply_json(400, ['error' => 'Could not encode the site content.']);
    $temporary = @tempnam($siteRoot, '.content-');
    if ($temporary === false || @file_put_contents($temporary, $encoded . PHP_EOL, LOCK_EX) === false) {
        if (is_string($temporary)) @unlink($temporary);
        reply_json(500, ['error' => 'Could not save content.json. Check that the site folder is writable.']);
    }
    @chmod($temporary, 0644);
    if (!@rename($temporary, $siteRoot . DIRECTORY_SEPARATOR . 'content.json')) {
        @unlink($temporary);
        reply_json(500, ['error' => 'Could not save content.json. Check that the site folder is writable.']);
    }
    reply_json(200, ['content' => $next]);
}

function handle_contact_status(): void
{
    reply_json(200, ['configured' => (bool) (site_setting('RESEND_API_KEY') && site_setting('RESEND_FROM_EMAIL'))]);
}

function send_resend_email(string $apiKey, array $payload): bool
{
    $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) return false;
    if (function_exists('curl_init')) {
        $curl = curl_init('https://api.resend.com/emails');
        curl_setopt_array($curl, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 8, CURLOPT_TIMEOUT => 20, CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json'], CURLOPT_POSTFIELDS => $json]);
        $response = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        curl_close($curl);
        return $response !== false && $status >= 200 && $status < 300;
    }
    $context = stream_context_create(['http' => ['method' => 'POST', 'header' => "Authorization: Bearer $apiKey\r\nContent-Type: application/json\r\n", 'content' => $json, 'timeout' => 20, 'ignore_errors' => true]]);
    $response = @file_get_contents('https://api.resend.com/emails', false, $context);
    $statusLine = $http_response_header[0] ?? '';
    return $response !== false && preg_match('/\s2\d\d\s/', $statusLine) === 1;
}

function handle_contact(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') reply_json(405, ['error' => 'Method not allowed.']);
    $data = request_json(12000);
    if (!empty($data['website'])) reply_json(200, ['sent' => true]);
    $name = trim((string) ($data['name'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));
    if ($name === '' || strlen($name) > 100 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 200 || strlen($message) < 5 || strlen($message) > 5000) reply_json(400, ['error' => 'Please check your name, email, and message.']);
    $key = site_setting('RESEND_API_KEY');
    $from = site_setting('RESEND_FROM_EMAIL');
    if (!$key || !$from) reply_json(503, ['error' => 'Email delivery is not configured yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL to the private .env file.']);
    $payload = ['from' => $from, 'to' => ['saugatpokhrel069@gmail.com'], 'reply_to' => $email, 'subject' => 'Portfolio message from ' . $name, 'text' => "From: $name\nReply to: $email\n\n$message"];
    if (!send_resend_email($key, $payload)) reply_json(502, ['error' => 'The email service could not deliver this message. Please try emailing directly.']);
    reply_json(200, ['sent' => true]);
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
if ($path === '/api/admin/session') handle_session($method);
if ($path === '/api/content') handle_content($method);
if ($path === '/api/contact/status' && $method === 'GET') handle_contact_status();
if ($path === '/api/contact') handle_contact();
reply_json(404, ['error' => 'API endpoint not found.']);
