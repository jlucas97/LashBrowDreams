<?php
class billing
{
    public function index($param)
    {
        $invoiceM = new InvoiceModel;
        $query = isset($_GET['query']) ? $_GET['query'] : '';

         if (strpos($param, '@') !== false){
            // Si el parámetro es un email, filtrar por usuario
            $response = $invoiceM->getInvoiceListByUser($param, $query);
        } else {
            // Si el parámetro no es un email, asumir que es el ID de la tienda
            $response = $invoiceM->getInvoiceListByStore($param, $query);
        }

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

    public function getProformasByUser($userEmail) {
        try {
            // Instanciación correcta de la clase InvoiceModel
            $invoiceM = new InvoiceModel();
            
            // Llamada correcta al método getProformaInvoicesByUser sin el signo de dolar delante de $invoiceM
            $proformas = $invoiceM->getProformaInvoicesByUser($userEmail);
            
            // Devolver la respuesta en formato JSON
            echo json_encode($proformas);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    

    public function get($id)
    {
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

    public function create()
    {
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
