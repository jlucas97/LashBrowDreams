<?php

class user
{
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
}
