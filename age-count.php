<?php
// Dem luot xac nhan do tuoi (khong luu IP). POST {c:"adult"|"minor"} de ghi; GET ?k=KEY de xem thong ke.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require __DIR__ . '/api/trpc/orders-lib.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');
$f = mdw_orders_dir() . '/age-counts.json';
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['k']) || !is_file(mdw_orders_dir() . '/age-key.txt') || !hash_equals(trim((string)@file_get_contents(mdw_orders_dir() . '/age-key.txt')), (string)$_GET['k'])) { http_response_code(403); echo '{"ok":false}'; exit; }
    $d = is_file($f) ? json_decode((string)file_get_contents($f), true) : [];
    $t = ['adult' => 0, 'minor' => 0];
    foreach ((array)$d as $day) { foreach ($t as $k => $v) { $t[$k] += isset($day[$k]) ? (int)$day[$k] : 0; } }
    echo json_encode(['ok' => true, 'total' => $t, 'byDay' => $d], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); header('Allow: GET, POST'); echo '{"ok":false}'; exit; }
$b = json_decode((string)file_get_contents('php://input'), true);
$c = (is_array($b) && isset($b['c'])) ? $b['c'] : '';
if ($c !== 'adult' && $c !== 'minor') { http_response_code(400); echo '{"ok":false}'; exit; }
$fh = @fopen($f, 'c+');
if (!$fh) { echo '{"ok":false}'; exit; }
flock($fh, LOCK_EX);
$d = json_decode((string)stream_get_contents($fh), true);
if (!is_array($d)) { $d = []; }
$day = date('Y-m-d');
if (!isset($d[$day])) { $d[$day] = ['adult' => 0, 'minor' => 0]; }
$d[$day][$c]++;
ftruncate($fh, 0); rewind($fh);
fwrite($fh, json_encode($d));
flock($fh, LOCK_UN); fclose($fh);
echo '{"ok":true}';
