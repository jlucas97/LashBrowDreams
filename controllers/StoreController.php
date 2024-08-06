<?php

class store
{
    // Get subcategory by category id
    public function index()
    {
        // Subcategory instance
        $storeM = new StoreModel;

        $response = $storeM->getStores();

        if (isset($response) && !empty($response)) {
            // Show answer on JSON format
            $json = array(
                'status' => 200,
                'results' => $response
            );
        } else {
            // JSON answer in case resource does not exist
            $json = array(
                'status' => 400,
                'results' => "The resource requested does not exist"
            );
        }
        // Show JSON answer with the HTTP response
        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }
    
}
