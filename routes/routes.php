<?php

$replaceChars = ["&", "/", "?"];
$routesArray = explode("/", str_replace($replaceChars, "/", $_SERVER['REQUEST_URI']));
$routesArray = array_filter($routesArray);

// No API request
if (count($routesArray) < 3) {
    $json = array(
        'status' => 404,
        'result' => 'Not found'
    );
    echo json_encode($json, http_response_code($json["status"]));
    return;
}

// API request
if (count($routesArray) >= 3 && isset($_SERVER['REQUEST_METHOD'])) {
    $controller = $routesArray[2];
    $action = "index";

    try {
        // Verificar que el controlador exista
        if (!class_exists($controller)) {
            throw new Exception("Controller not found");
        }

        $response = new $controller();

        // Para GET con parámetros en la URL
        if (count($routesArray) == 4 && $_SERVER['REQUEST_METHOD'] == 'GET') {
            $param = $routesArray[3];
            if (method_exists($response, $action)) {
                $response->$action($param);
            } else {
                throw new Exception("Method $action not found");
            }
        } else if (count($routesArray) > 4) {
            // Para llamadas con múltiples parámetros
            $action = $routesArray[3];
            $parameters = array_slice($routesArray, 4);

            if (method_exists($response, $action)) {
                call_user_func_array(array($response, $action), $parameters);
            } else {
                throw new Exception("Method $action not found");
            }
        } else {
            // Para llamadas sin parámetros o con parámetros en la ruta
            if (method_exists($response, $action)) {
                $response->$action();
            } else {
                throw new Exception("Method $action not found");
            }
        }

    } catch (\Throwable $th) {
        $json = array(
            'status' => 404,
            'result' => $th->getMessage()
        );
        echo json_encode($json, http_response_code($json["status"]));
    }
}
