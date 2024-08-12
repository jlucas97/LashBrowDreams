<?php

$replaceChars = ["&", "/", "?"];
$routesArray = explode("/", str_replace($replaceChars, "/", $_SERVER['REQUEST_URI']));
$routesArray = array_filter($routesArray);

// Log de las rutas analizadas
error_log("Rutas analizadas: " . json_encode($routesArray));

// No API request
if (count($routesArray) == 1) {
    $json = array(
        'status' => 404,
        'result' => 'Not found'
    );
    echo json_encode(
        $json,
        http_response_code($json["status"])
    );
    return;
}

// API request
// http://localhost:81/projectName/controller/action/parameter
if (count($routesArray) > 1 && isset($_SERVER['REQUEST_METHOD'])) {
    $controller = $routesArray[2];
    $action = "index";

    // Log del método HTTP
    error_log("Método HTTP: " . $_SERVER['REQUEST_METHOD']);

    try {
        $response = new $controller();

        // Log del controlador
        error_log("Controlador: " . $controller);

        if (count($routesArray) <= 3) {
            switch ($_SERVER['REQUEST_METHOD']) {
                case 'GET':
                    $action = "index";
                    break;
                case 'POST':
                    $action = "create";
                    break;
                case 'PUT':
                case 'PATCH':
                    $action = "update";
                    break;
                case 'DELETE':
                    $action = "delete";
                    break;
                default:
                    $action = "index";
                    break;
            }

            // Log de la acción
            error_log("Acción: " . $action);

            if (count($routesArray) == 3) {
                $param = $routesArray[3];
                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'GET':
                        if ($param === 'get') {
                            $action = "get";
                        } else {
                            $action = "getById";
                        }
                        $response->$action($param);
                        break;
                    case 'POST':
                        $action = $routesArray[3];
                        $response->$action();
                        break;
                    default:
                        $action = "index";
                        $response->$action();
                        break;
                }
            } else {
                $response->$action();
            }
        }

        if (count($routesArray) >= 4) {
            $action = $routesArray[3];
            $parameters = array();
            for ($i = 4; $i <= count($routesArray); $i++) {
                $parameters[] = $routesArray[$i];
            }
            $response = call_user_func_array(array($response, $action), $parameters);
        }
    } catch (\Throwable $th) {
        $json = array(
            'status' => 404,
            'result' => $th
        );
        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }
}
