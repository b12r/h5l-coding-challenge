<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $trackingId = filter_input(INPUT_POST, 'trackingId');
    if ($trackingId !== NULL) {
        addToLog('investigate.log', $trackingId);
    } else {
        http_response_code(400);
    }
} else {
    http_response_code(405);
}

function addToLog($filePath, $trackingId) {
    file_put_contents($filePath, date('Y-m-d H:i:s') . ' ' . $trackingId . PHP_EOL, FILE_APPEND);
}
