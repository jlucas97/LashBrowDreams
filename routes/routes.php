<?php

$replaceChars = ["&","/","?"];
$routesArray = explode("/", str_replace($replaceChars, "/", $_SERVER['REQUEST_URI']));
$routesArray = array_filter($routesArray);
//print_r($routesArray);
//http: //localhost:81/lashbrowdreams/

//No API request
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

//API request
//http://localhost:81/projectName/controller/action/parameter
if (count($routesArray) > 1 && isset($_SERVER['REQUEST_METHOD'])) {
    $controller = $routesArray[2];
    $action = "index";
    try {
        $response = new $controller();
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
            if (count($routesArray) == 3) {
                $param = $routesArray[3];
                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'GET':
                        $action = "get";
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
            $response = call_user_func_array(array($response,$action), $parameters);
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
