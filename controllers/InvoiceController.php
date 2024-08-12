<?php
class billing {
    public function index($id) {
        $invoiceM = new InvoiceModel;
        $query = isset($_GET['query']) ? $_GET['query'] : '';

        $response = $invoiceM->getInvoiceListByStore($id, $query);

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

    public function get($id) {
        $invoiceM = new InvoiceModel;
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

    public function create() {
        $data = json_decode(file_get_contents("php://input"), true);

        $invoiceM = new InvoiceModel;

        $invoiceId = $invoiceM->createInvoice($data);
        if ($invoiceId) {
            $json = array(
                'status' => 200,
                'results' => "Factura creada exitosamente"
            );
        } else {
            $json = array(
                'status' => 400,
                'results' => "Error al crear la factura"
            );
        }

        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }
}
