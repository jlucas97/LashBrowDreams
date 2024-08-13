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

    public function login()
{
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $userM = new UserModel;
    $user = $userM->getUserByEmail($email);

    // Comparar directamente si las contraseñas están en texto plano
    if ($user && $password === $user->password) {
        $json = array(
            'status' => 200,
            'results' => array(
                'message' => 'Login successful',
                'user' => $user,
                'token' => 'sampleToken'
            )
        );
    } else {
        $json = array(
            'status' => 401,
            'results' => 'Invalid credentials'
        );
    }

    echo json_encode(
        $json,
        http_response_code($json["status"])
    );
}

}
