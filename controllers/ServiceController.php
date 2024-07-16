<?php

class service
{
    //Get all Categories
    public function index()
    {
        //Category instance
        $serviceM = new ServiceModel;
        //Model method
        $response = $serviceM->getServices();

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

    public function get($id)
    {
        //Category instance
        $serviceM = new ServiceModel;
        //Model method
        $response = $serviceM->getServiceById($id);

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
