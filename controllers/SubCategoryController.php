<?php

class subcategory
{
    // Get subcategory by category id
    public function get($id)
    {
        // Subcategory instance
        $sCategoryM = new SubCategoryModel;

        $response = $sCategoryM->getSubCategoriesByCategoryId($id);

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
