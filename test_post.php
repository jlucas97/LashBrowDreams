<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    error_log("Datos recibidos: " . json_encode($data));
    echo json_encode([
        'status' => 200,
        'message' => 'POST recibido correctamente',
        'data' => $data
    ]);
} else {
    echo json_encode([
        'status' => 405,
        'message' => 'Método no permitido'
    ]);
}
