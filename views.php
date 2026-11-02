<?php
// Dem luot xem bai viet (khong luu IP). POST {s:"slug"} +1; GET ?all=1 hoac ?s=slug de doc.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require __DIR__ . '/api/trpc/orders-lib.php';
$f = mdw_orders_dir() . '/views.json';
function vslug($s){ return is_string($s) && preg_match('/^[a-z0-9-]{3,120}$/', $s) && is_dir(__DIR__ . '/tin-tuc/' . $s); }
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $d = is_file($f) ? json_decode((string)file_get_contents($f), true) : [];
    if (!is_array($d)) { $d = []; }
    if (isset($_GET['s'])) { $s = $_GET['s']; echo json_encode(['ok' => true, 'n' => vslug($s) && isset($d[$s]) ? (int)$d[$s] : 0]); exit; }
    echo json_encode(['ok' => true, 'v' => $d]); exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
$ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
$b = json_decode((string)file_get_contents('php://input'), true);
$s = (is_array($b) && isset($b['s'])) ? $b['s'] : '';
if (!vslug($s)) { http_response_code(400); echo '{"ok":false}'; exit; }
$bot = ($ua === '' || preg_match('/bot|crawl|spider|slurp|facebookexternalhit|headless|curl|wget/i', $ua));
$fh = @fopen($f, 'c+');
if (!$fh) { echo '{"ok":false}'; exit; }
flock($fh, LOCK_EX);
$d = json_decode((string)stream_get_contents($fh), true);
if (!is_array($d)) { $d = []; }
if (!$bot) { $d[$s] = (isset($d[$s]) ? (int)$d[$s] : 0) + 1; ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($d)); }
flock($fh, LOCK_UN); fclose($fh);
echo json_encode(['ok' => true, 'n' => isset($d[$s]) ? (int)$d[$s] : 0]);
