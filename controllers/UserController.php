<?php

class user
{
    public function index()
    {
        $userM = new UserModel;
        $response = $userM->getUsers();

        if (isset($response) && !empty($response)) {
            $json = array(
                'status' => 200,
                'results' => $response
            );
        } else {
            $json = array(
                'status' => 400,
                'results' => "The resource requested does not exist"
            );
        }

        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }

    public function get($id)
    {
        $userM = new UserModel;
        $response = $userM->getUsersById($id);

        if (isset($response) && !empty($response)) {
            $json = array(
                'status' => 200,
                'results' => $response
            );
        } else {
            $json = array(
                'status' => 400,
                'results' => "The resource requested does not exist"
            );
        }

        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }

    public function getAdminByStore($storeId)
    {
        $userM = new UserModel;
        $response = $userM->getAdminByStore($storeId);
        if ($response) {
            echo json_encode(['status' => 200, 'results' => $response]);
        } else {
            echo json_encode(['status' => 404, 'results' => 'No admin found for this store']);
        }
    }

    public function login() {
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $email = $data['email'] ?? '';
            $password = $data['password'] ?? '';
            $storeId = $data['storeId'] ?? '';
            
    
            $userM = new UserModel;
            $user = $userM->getUserByEmail($email);
            $role = $user->roleId;

    
            // Comparar contraseñas en texto plano
            if ($user && $password === $user->password) {

                if ($role == 2) {
                    // Verificar si el usuario está asociado al storeId
                    $isUserAssociated = $userM->isUserAssociatedWithStore($email, $storeId);
                    if (!$isUserAssociated) {
                        throw new Exception("El usuario no pertenece a esta sucursal", 403);
                    }
                }
    
                $json = array(
                    'status' => 200,
                    'results' => array(
                        'message' => 'Login successful',
                        'user' => $user,
                        'token' => 'sampleToken'
                    )
                );
            } else {
                throw new Exception("Credenciales inválidas", 401);
            }
    
            echo json_encode($json, http_response_code($json["status"]));
        } catch (Exception $e) {
            $json = array(
                'status' => $e->getCode() ?: 500,
                'results' => $e->getMessage()
            );
            echo json_encode($json, http_response_code($json["status"]));
        }
    }
    
}
