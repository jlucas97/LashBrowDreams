<?php
class provider
{
    //GET all providers
    public function index()
    {
        //Provider Instance
        $providerM = new ProviderModel;
        //Model method
        $response = $providerM->getProviders();
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
