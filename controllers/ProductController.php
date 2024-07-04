<?php
class product
{
    //GET all providers
    public function index()
    {
        //Provider Instance
        $productM = new ProductModel;
        //Model method
        $response = $productM->getProducts();

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
        //Instance of the model
        $productM = new ProductModel();
        //Method of the model
        $response = $productM->getProductById($id);
        //Answer validator
        if (isset($response) && !empty($response)) {
            //Show answer on JSON format
            $json = array(
                'status' => 200,
                'results' => $response
            );
        } else {
            //JSON answer in case resource does not exist
            $json = array(
                'status' => 400,
                'results' => "The resource requested does not exist"
            );
        }
        //Show JSON answer with the HTTP response
        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }
}

