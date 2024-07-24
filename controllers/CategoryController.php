<?php

class category
{
    //Get all Categories
    public function index()
    {
        //Category instance
        $categoryM = new CategoryModel;
        //Model method
        $response = $categoryM->getCategories();

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

    public function get($id){
        $categoryM = new CategoryModel;
        //Model method
        $response = $categoryM->getCategoryById($id);

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
