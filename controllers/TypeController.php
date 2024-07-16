<?php

class type
{
    //Get all Categories
    public function index()
    {
        //Category instance
        $typeM = new TypeModel;
        //Model method
        $response = $typeM->getTypes();

        if (isset($response) && !empty($response)) {
            $json = array(
                'status' => 200,
                'results' => $response
            );
        } else {
            $json = array(
                'status' => 400,
                'results' => "No entries"
            );
        }
        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }
}
