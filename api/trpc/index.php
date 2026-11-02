<?php
// Tương thích tRPC (superjson) cho giỏ hàng: orderRequests.create
require __DIR__ . '/orders-lib.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$path = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '', PHP_URL_PATH);
$proc = urldecode((string)substr($path, strlen('/api/trpc/')));
$procs = array_values(array_filter(explode(',', $proc), 'strlen'));
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
$isBatch = isset($_GET['batch']);
$body = json_decode((string)file_get_contents('php://input'), true);
function t_err($msg, $code, $http, $p) {
    return ['http' => $http, 'body' => ['error' => ['json' => ['message' => $msg, 'code' => -32603, 'data' => ['code' => $code, 'httpStatus' => $http, 'path' => $p]]]]];
}
$results = [];
foreach ($procs as $i => $p) {
    if ($p === 'orderRequests.create' && $method === 'POST') {
        $in = $isBatch ? (isset($body[(string)$i]['json']) ? $body[(string)$i]['json'] : null) : (isset($body['json']) ? $body['json'] : null);
        if (!is_array($in)) { $results[] = t_err('Dữ liệu không hợp lệ.', 'BAD_REQUEST', 400, $p); continue; }
        $r = mdw_create_order(
            isset($in['customerName']) ? $in['customerName'] : '',
            isset($in['phone']) ? $in['phone'] : '',
            isset($in['address']) ? $in['address'] : '',
            isset($in['note']) ? $in['note'] : '',
            isset($in['items']) ? $in['items'] : []
        );
        if (!$r['ok']) { $results[] = t_err($r['message'], $r['code'], $r['http'], $p); continue; }
        $results[] = ['http' => 200, 'body' => ['result' => ['data' => ['json' => ['reference' => $r['reference']]]]]];
    } elseif ($p === 'auth.me' && $method === 'GET') {
        $results[] = ['http' => 200, 'body' => ['result' => ['data' => ['json' => null]]]];
    } else {
        $results[] = t_err('Không tìm thấy: ' . $p, 'NOT_FOUND', 404, $p);
    }
}
if (!$results) { $results[] = t_err('Không tìm thấy', 'NOT_FOUND', 404, ''); }
$http = 200;
foreach ($results as $r) { if ($r['http'] !== 200) { $http = $r['http']; break; } }
http_response_code($isBatch ? ($http === 200 ? 200 : 207) : $http);
$out = array_map(function ($r) { return $r['body']; }, $results);
echo json_encode($isBatch ? $out : $out[0], JSON_UNESCAPED_UNICODE);
