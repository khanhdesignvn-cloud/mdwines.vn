<?php
// MD Wines - xử lý đơn đặt hàng (không cần database)
// Lưu đơn vào /orders (ngoài public_html) và gửi email cho chủ shop.
const MDW_OWNER_EMAIL = 'minhngocphucqt@gmail.com';

function mdw_products() {
    return [
        'md-cabernet-sauvignon-2022' => ['MD Cabernet Sauvignon 2022', 550000],
        'md-shiraz-2021' => ['MD Shiraz 2021', 550000],
        'md-cabernet-sauvignon-coonawarra-2021' => ['MD 90 Cabernet Sauvignon Coonawarra 2021', 900000],
        'md-the-quietude-04' => ['MD The Quietude 04', 950000],
        'md-77-shiraz-barossa-2020' => ['MD 77 Shiraz Barossa Valley 2020', 1300000],
        'ghe-1575-return-2022' => ['GHE 1575 Return 2022', 1500000],
    ];
}

function mdw_line($s, $max) {
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', (string)$s);
    return mb_substr(trim((string)$s), 0, $max);
}

function mdw_text($s, $max) {
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', (string)$s);
    return mb_substr(trim((string)$s), 0, $max);
}

function mdw_fail($message, $code = 'BAD_REQUEST', $http = 400) {
    return ['ok' => false, 'message' => $message, 'code' => $code, 'http' => $http];
}

function mdw_orders_dir() {
    $dir = dirname(__DIR__, 3) . '/orders';
    if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
    return $dir;
}

function mdw_rate_limited($dir) {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'x';
    $f = $dir . '/.rl-' . md5($ip);
    $now = time();
    $hits = [];
    if (is_file($f)) {
        foreach (explode(',', (string)@file_get_contents($f)) as $t) {
            $t = (int)$t;
            if ($t > 0 && $now - $t < 600) { $hits[] = $t; }
        }
    }
    if (count($hits) >= 5) { return true; }
    $hits[] = $now;
    @file_put_contents($f, implode(',', $hits), LOCK_EX);
    return false;
}

function mdw_money($n) { return number_format($n, 0, ',', '.') . ' ₫'; }

function mdw_send_mail($o) {
    $host = preg_replace('/^www\./', '', isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'mdwines.vn');
    $host = preg_replace('/[^a-z0-9.\-]/i', '', $host);
    $from = 'no-reply@' . $host;
    $body = "ĐƠN ĐẶT HÀNG MỚI - " . $o['reference'] . "\n"
        . "Thời gian: " . $o['createdAt'] . "\n\n"
        . "Khách hàng: " . $o['customerName'] . "\n"
        . "Điện thoại: " . $o['phone'] . "\n"
        . "Địa chỉ: " . $o['address'] . "\n";
    if ($o['note'] !== '') { $body .= "Ghi chú: " . $o['note'] . "\n"; }
    $body .= "\nSản phẩm:\n";
    foreach ($o['items'] as $it) {
        $body .= "- " . $it['name'] . " x " . $it['quantity'] . " = " . mdw_money($it['subtotal']) . "\n";
    }
    $body .= "\nTỔNG (giá bán lẻ): " . mdw_money($o['total']) . "\n"
        . "\nLiên hệ khách để xác nhận tồn kho, phí vận chuyển và thời gian giao.\n";
    $subject = '=?UTF-8?B?' . base64_encode('[MD Wines] Đơn mới ' . $o['reference'] . ' - ' . $o['customerName']) . '?=';
    $headers = "From: MD Wines <" . $from . ">\r\nContent-Type: text/plain; charset=UTF-8\r\nX-Mailer: MDWines";
    return mdw_deliver($subject, $body, $headers);
}

function mdw_create_order($name, $phone, $address, $note, $items) {
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    $name = mdw_line($name, 100);
    $address = mdw_line($address, 300);
    $note = mdw_text($note, 500);
    if (mb_strlen($name) < 2) { return mdw_fail('Vui lòng nhập họ và tên.'); }
    $p = preg_replace('/[\s.\-()]/', '', (string)$phone);
    if (!preg_match('/^(\+?84|0)\d{9,10}$/', $p)) { return mdw_fail('Số điện thoại chưa hợp lệ.'); }
    if (mb_strlen($address) < 8) { return mdw_fail('Vui lòng nhập địa chỉ nhận hàng đầy đủ.'); }
    if (!is_array($items) || count($items) < 1 || count($items) > 20) { return mdw_fail('Giỏ hàng đang trống.'); }
    $cat = mdw_products();
    $merged = [];
    foreach ($items as $it) {
        $id = is_array($it) && isset($it['productId']) ? (string)$it['productId'] : '';
        $q = is_array($it) && isset($it['quantity']) ? (int)$it['quantity'] : 0;
        if (!isset($cat[$id]) || $q < 1 || $q > 99) { return mdw_fail('Sản phẩm không hợp lệ.'); }
        $merged[$id] = (isset($merged[$id]) ? $merged[$id] : 0) + $q;
    }
    $lines = [];
    $total = 0;
    foreach ($merged as $id => $q) {
        $sub = $cat[$id][1] * min($q, 99);
        $total += $sub;
        $lines[] = ['productId' => $id, 'name' => $cat[$id][0], 'quantity' => min($q, 99), 'unitPrice' => $cat[$id][1], 'subtotal' => $sub];
    }
    $isTest = (stripos($name, 'TEST') === 0);
    $ref = 'MDW-' . date('ymd') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
    $order = [
        'reference' => $ref, 'createdAt' => date('Y-m-d H:i:s'), 'customerName' => $name, 'phone' => $p,
        'address' => $address, 'note' => $note, 'items' => $lines, 'total' => $total,
        'test' => $isTest, 'ip' => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
    ];
    $dir = mdw_orders_dir();
    if (!$isTest && mdw_rate_limited($dir)) { return mdw_fail('Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau ít phút hoặc gọi hotline.', 'TOO_MANY_REQUESTS', 429); }
    $saved = @file_put_contents($dir . '/orders-' . date('Y-m') . '.jsonl', json_encode($order, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    $mailed = $isTest ? false : mdw_send_mail($order);
    if ($saved === false && !$mailed && !$isTest) {
        return mdw_fail('Chưa gửi được yêu cầu. Vui lòng gọi hotline 0913 485 279 để đặt hàng.', 'INTERNAL_SERVER_ERROR', 500);
    }
    return ['ok' => true, 'reference' => $ref, 'total' => $total, 'saved' => $saved !== false, 'mailed' => (bool)$mailed];
}

function mdw_mail_raw($subjectText, $body) {
    $host = preg_replace('/^www\./', '', isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'mdwines.vn');
    $host = preg_replace('/[^a-z0-9.\-]/i', '', $host);
    $subject = '=?UTF-8?B?' . base64_encode(mdw_line($subjectText, 150)) . '?=';
    $headers = "From: MD Wines <no-reply@" . $host . ">\r\nContent-Type: text/plain; charset=UTF-8\r\nX-Mailer: MDWines";
    return mdw_deliver($subject, $body, $headers);
}

// Gửi qua SMTP có xác thực nếu có file cấu hình ngoài web: <orders>/smtp.txt (dòng 1: tài khoản, dòng 2: mật khẩu)
function mdw_smtp_send($user, $pass, $to, $subject, $headers, $body) {
    $ctx = stream_context_create(['ssl' => ['verify_peer' => false, 'verify_peer_name' => false]]);
    $fp = @stream_socket_client('ssl://127.0.0.1:465', $en, $es, 12, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) { return false; }
    stream_set_timeout($fp, 12);
    $rd = function () use ($fp) { $r = ''; while (($l = fgets($fp, 515)) !== false) { $r .= $l; if (strlen($l) < 4 || $l[3] === ' ') break; } return $r; };
    $cmd = function ($c, $ok) use ($fp, $rd) { if ($c !== null) fwrite($fp, $c . "\r\n"); $r = $rd(); return strpos($r, $ok) === 0; };
    $okAll = $cmd(null, '220') && $cmd('EHLO mdwines.vn', '250') && $cmd('AUTH LOGIN', '334') && $cmd(base64_encode($user), '334') && $cmd(base64_encode($pass), '235')
        && $cmd('MAIL FROM:<' . $user . '>', '250') && $cmd('RCPT TO:<' . $to . '>', '250') && $cmd('DATA', '354');
    if ($okAll) {
        $msg = 'To: ' . $to . "\r\nSubject: " . $subject . "\r\n" . $headers . "\r\n\r\n" . $body;
        $msg = preg_replace('/^\./m', '..', $msg);
        fwrite($fp, $msg . "\r\n.\r\n");
        $okAll = strpos($rd(), '250') === 0;
    }
    @fwrite($fp, "QUIT\r\n"); @fclose($fp);
    return $okAll;
}

// Thông báo Telegram (kênh dự phòng cho email): file ngoài web <orders>/telegram.txt (dòng 1: bot token, dòng 2: chat id)
function mdw_telegram($text) {
    $cfg = @file(mdw_orders_dir() . '/telegram.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!$cfg || count($cfg) < 2) { return null; }
    $token = trim($cfg[0]); $chat = trim($cfg[1]);
    if (!preg_match('/^\d+:[A-Za-z0-9_\-]+$/', $token)) { return false; }
    $data = http_build_query(['chat_id' => $chat, 'text' => mb_substr($text, 0, 3900), 'disable_web_page_preview' => 'true']);
    $url = 'https://api.telegram.org/bot' . $token . '/sendMessage';
    $res = false;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $data, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 5]);
        $res = curl_exec($ch); curl_close($ch);
    } else {
        $res = @file_get_contents($url, false, stream_context_create(['http' => ['method' => 'POST', 'header' => 'Content-Type: application/x-www-form-urlencoded', 'content' => $data, 'timeout' => 8]]));
    }
    $j = $res ? json_decode($res, true) : null;
    return is_array($j) && !empty($j['ok']);
}

function mdw_deliver($subject, $body, $headers) {
    $host = preg_replace('/^www\./', '', isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'mdwines.vn');
    $host = preg_replace('/[^a-z0-9.\-]/i', '', $host);
    $headers = preg_replace('/Content-Type:[^\r\n]*/i', 'MIME-Version: 1.0', $headers);
    $headers .= "\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64"
        . "\r\nMessage-ID: <" . bin2hex(random_bytes(8)) . "@" . $host . ">"
        . "\r\nDate: " . date('r');
    $ok = false; $via = 'mail';
    $cfg = @file($dir0 = mdw_orders_dir() . '/smtp.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($cfg && count($cfg) >= 2) {
        $su = trim($cfg[0]);
        $h2 = preg_replace('/^From:[^\r\n]*/mi', 'From: MD Wines <' . $su . '>', $headers);
        $ok = mdw_smtp_send($su, trim($cfg[1]), MDW_OWNER_EMAIL, $subject, $h2, chunk_split(base64_encode($body)));
        $via = 'smtp';
    }
    if (!$ok) { $via = 'mail'; $ok = @mail(MDW_OWNER_EMAIL, $subject, chunk_split(base64_encode($body)), $headers, '-f no-reply@' . $host); }
    if (!$ok) { $ok = @mail(MDW_OWNER_EMAIL, $subject, chunk_split(base64_encode($body)), $headers); }
    $dir = mdw_orders_dir();
    @file_put_contents($dir . '/mail.log', date('c') . ' ' . ($ok ? 'SENT' : 'FAIL') . '/' . $via . ' to=' . MDW_OWNER_EMAIL . ' ' . mb_substr(preg_replace('/\s+/', ' ', $body), 0, 60) . "\n", FILE_APPEND | LOCK_EX);
    $tgText = (function_exists('iconv_mime_decode') ? iconv_mime_decode($subject, 0, 'UTF-8') : $subject) . "\n\n" . $body;
    $tg = mdw_telegram($tgText);
    if ($tg !== null) { @file_put_contents($dir . '/mail.log', date('c') . ' TELEGRAM ' . ($tg ? 'SENT' : 'FAIL') . "\n", FILE_APPEND | LOCK_EX); }
    return $ok || $tg === true;
}
