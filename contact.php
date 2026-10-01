<?php
// GHID contact form → info@ghidcongo.org (for DirectAdmin / any PHP hosting).
// No password needed: the server's own mail system sends it.
// The mailbox info@ghidcongo.org should exist in DirectAdmin (E-mail Manager → E-mail Accounts).

$TO   = 'info@ghidcongo.org';
$FROM = 'info@ghidcongo.org';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) { $data = $_POST; }

function clean($v, $max) {
    $v = trim(str_replace("\r", '', (string)($v ?? '')));
    return mb_substr($v, 0, $max, 'UTF-8');
}

// Spam trap: people never fill the hidden "website" field.
if (clean($data['website'] ?? '', 200) !== '') { echo json_encode(['ok' => true]); exit; }

$topics = [
    'general'  => 'General enquiry / Demande générale',
    'research' => 'Research collaboration / Collaboration de recherche',
    'funding'  => 'Funding or partnership / Financement ou partenariat',
    'media'    => 'Media or speaking request / Demande média ou intervention',
    'other'    => 'Other / Autre',
];

$name    = clean($data['name'] ?? '', 120);
$email   = clean($data['email'] ?? '', 200);
$message = clean($data['message'] ?? '', 5000);
$topicKey = isset($topics[$data['topic'] ?? '']) ? $data['topic'] : 'general';
$topic   = $topics[$topicKey];
$lang    = (($data['lang'] ?? '') === 'fr') ? 'French' : 'English';

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing or invalid fields']);
    exit;
}

// Stop header injection in the name.
$safeName = preg_replace('/[\r\n"<>]+/', ' ', $name);

$subject = '=?UTF-8?B?' . base64_encode("[GHID website] $topic — $safeName") . '?=';
$body = "Topic: $topic\nName: $name\nEmail: $email\nLanguage: $lang\n\n$message\n";

$headers  = "From: =?UTF-8?B?" . base64_encode('GHID website') . "?= <$FROM>\r\n";
$headers .= "Reply-To: =?UTF-8?B?" . base64_encode($safeName) . "?= <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = @mail($TO, $subject, $body, $headers, '-f' . $FROM);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Could not send the message']);
}
