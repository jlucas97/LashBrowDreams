<?php

class reservation {
    private $model;

    public function __construct() {
        $this->model = new ReservationModel();
    }

    public function getReservations($storeId) {
        $admin = isset($_GET['admin']) ? $_GET['admin'] : null;
        $customerId = isset($_GET['customerId']) ? $_GET['customerId'] : null;
        $date = isset($_GET['date']) ? $_GET['date'] : null;

        $reservations = $this->model->getReservations($storeId, $admin, $customerId, $date);

        if ($reservations) {
            $json = array(
                'status' => 200,
                'results' => $reservations
            );
        } else {
            $json = array(
                'status' => 404,
                'results' => "No reservations found"
            );
        }

        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }

    public function get($id) {
        $reservation = $this->model->getReservationById($id);

        if ($reservation) {
            $json = array(
                'status' => 200,
                'results' => $reservation
            );
        } else {
            $json = array(
                'status' => 404,
                'results' => "Reservation not found"
            );
        }

        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }

    public function create() {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (strtotime($data['date']) < strtotime(date('Y-m-d'))) {
            $json = array(
                'status' => 400,
                'result' => 'La fecha seleccionada no puede ser anterior a la actual.'
            );
            echo json_encode($json, http_response_code($json['status']));
            return;
        }

        $result = $this->model->createReservation($data);
        if ($result) {
            // Crear proforma después de registrar la reserva
            $this->createProforma($result, $data);

            $json = array(
                'status' => 200,
                'result' => 'Reserva registrada exitosamente.'
            );
        } else {
            $json = array(
                'status' => 500,
                'result' => 'Error al registrar la reserva.'
            );
        }

        echo json_encode($json, http_response_code($json['status']));
    }

    private function createProforma($reservationId, $data) {
        $conn = new MySqlConnect();
        $conn->connect();

        // Insertar la proforma en la tabla `invoice`
        $sqlInvoice = "INSERT INTO `invoice` (`date`, `time`, `customerId`, `storeId`, `type`)
                       VALUES (?, ?, ?, ?, 'Proforma')";
        $paramsInvoice = [$data['date'], $data['time'], $data['customerId'], $data['storeId']];
        $invoiceId = $conn->executeSQL_DML_last($sqlInvoice, $paramsInvoice);

        // Insertar el detalle de la proforma en la tabla `invoice_detail`
        $sqlInvoiceDetail = "INSERT INTO `invoice_detail` (`invoiceId`, `serviceId`, `quantity`, `total`)
                             VALUES (?, ?, ?, ?)";
        
        $serviceId = $data['serviceId'];
        $quantity = 1; // Asumiendo que es 1 servicio por reserva
        $servicePrice = $this->getServicePrice($serviceId); // Obtener el precio del servicio

        $paramsInvoiceDetail = [$invoiceId, $serviceId, $quantity, $servicePrice * $quantity];
        $conn->executeSQL_DML($sqlInvoiceDetail, $paramsInvoiceDetail);

        // Calcular subtotal, impuesto (13%) y total
        $subtotal = $servicePrice * $quantity;
        $taxAmount = $subtotal * 0.13;
        $total = $subtotal + $taxAmount;

        // Insertar el total en la tabla `invoice_total`
        $sqlInvoiceTotal = "INSERT INTO `invoice_total` (`invoiceId`, `subtotal`, `taxAmount`, `total`)
                            VALUES (?, ?, ?, ?)";
        $paramsInvoiceTotal = [$invoiceId, $subtotal, $taxAmount, $total];
        $conn->executeSQL_DML($sqlInvoiceTotal, $paramsInvoiceTotal);

        $conn->close();
    }

    private function getServicePrice($serviceId) {
        // Obtener el precio del servicio desde la base de datos
        $conn = new MySqlConnect();
        $sql = "SELECT price FROM services WHERE id = ?";
        $result = $conn->executeSQL($sql, "num", [$serviceId]);
        return $result[0][0]; // Retorna el precio
    }

}
