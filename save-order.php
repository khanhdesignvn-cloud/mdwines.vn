<?php
// Nhận đơn từ checkout.html (POST JSON). Không tạo thư mục, không nhận GET.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
    exit;
}
require __DIR__ . '/api/trpc/orders-lib.php';
$d = json_decode((string)file_get_contents('php://input'), true);
if (!is_array($d)) { http_response_code(400); echo json_encode(['ok' => false, 'message' => 'Dữ liệu không hợp lệ.']); exit; }
$id = '';
$pname = isset($d['product']) ? (string)$d['product'] : '';
foreach (mdw_products() as $k => $v) { if (strcasecmp($v[0], $pname) === 0 || $k === $pname) { $id = $k; } }
$qty = isset($d['qty']) ? (int)$d['qty'] : 0;
$note = isset($d['note']) ? $d['note'] : '';
$r = mdw_create_order(
    isset($d['name']) ? $d['name'] : '', isset($d['phone']) ? $d['phone'] : '',
    isset($d['address']) ? $d['address'] : '', $note, [['productId' => $id, 'quantity' => $qty]]
);
if (!$r['ok']) { http_response_code($r['http']); echo json_encode(['ok' => false, 'message' => $r['message']], JSON_UNESCAPED_UNICODE); exit; }
echo json_encode(['ok' => true, 'created' => true, 'reference' => $r['reference']]);
