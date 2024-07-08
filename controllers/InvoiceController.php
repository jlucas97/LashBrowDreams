<?php
class billing
{
    //GET invoices list
    public function index()
    {
        //Provider Instance
        $invoiceM = new InvoiceModel;
        //Model method
        $response = $invoiceM->getInvoiceList();

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
        $invoiceM = new InvoiceModel;
        //Model method
        $response = $invoiceM->getInvoiceMasterDetail($id);

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
