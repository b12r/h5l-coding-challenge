<?php

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header("Content-Type: application/json");
    $data = file_get_contents('data.json');
    echo $data;
} else {
    http_response_code(405);
}
