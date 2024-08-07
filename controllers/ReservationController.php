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
}
