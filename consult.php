<?php
// Nhan form "Tu van" (POST JSON): luu file + gui email cho chu shop.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false]);
    exit;
}
require __DIR__ . '/api/trpc/orders-lib.php';
date_default_timezone_set('Asia/Ho_Chi_Minh');
$d = json_decode((string)file_get_contents('php://input'), true);
$fields = (is_array($d) && isset($d['fields']) && is_array($d['fields'])) ? array_slice($d['fields'], 0, 10) : [];
$rows = [];
$hasContact = false;
foreach ($fields as $f) {
    if (!is_array($f)) { continue; }
    $label = mdw_line(isset($f['label']) ? $f['label'] : '', 60);
    $val = mdw_text(isset($f['value']) ? $f['value'] : '', 500);
    if ($val === '') { continue; }
    $rows[] = [$label, $val];
    if (preg_match('/(điện thoại|dien thoai|phone|email)/iu', $label)) { $hasContact = true; }
}
if (!$rows || !$hasContact) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Vui lòng để lại số điện thoại hoặc email.'], JSON_UNESCAPED_UNICODE);
    exit;
}
$dir = mdw_orders_dir();
if (mdw_rate_limited($dir)) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'message' => 'Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau.'], JSON_UNESCAPED_UNICODE);
    exit;
}
$rec = ['createdAt' => date('Y-m-d H:i:s'), 'fields' => $rows, 'ip' => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''];
$saved = @file_put_contents($dir . '/consults-' . date('Y-m') . '.jsonl', json_encode($rec, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
$body = "YÊU CẦU TƯ VẤN MỚI - " . $rec['createdAt'] . "\n\n";
foreach ($rows as $r) { $body .= $r[0] . ': ' . $r[1] . "\n"; }
$mailed = mdw_mail_raw('[MD Wines] Yêu cầu tư vấn mới', $body);
if ($saved === false && !$mailed) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Chưa gửi được. Vui lòng gọi hotline 0913 485 279.'], JSON_UNESCAPED_UNICODE);
    exit;
}
echo json_encode(['ok' => true]);
