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
}
