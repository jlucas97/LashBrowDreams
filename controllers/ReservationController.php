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
        $data['admin'] = $this->getAdminByStore($data['storeId']);

        if (strtotime($data['date']) < strtotime(date('Y-m-d'))) {
            $json = array(
                'status' => 400,
                'result' => 'La fecha seleccionada no puede ser anterior a la actual.'
            );
            echo json_encode($json, http_response_code($json['status']));
            return;
        }

        if (!$this->isTimeAvailable($data['storeId'], $data['date'], $data['time'])) {
            $json = array(
                'status' => 400,
                'result' => 'El tiempo seleccionado no está disponible o está bloqueado.'
            );
            echo json_encode($json, http_response_code($json['status']));
            return;
        }

        $result = $this->model->createReservation($data);
        if ($result) {
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

    private function isTimeAvailable($storeId, $date, $time) {
        // Lógica para verificar si el tiempo está disponible
        $sql = "SELECT * FROM schedule WHERE storeId = ? AND dayOfWeek = ? AND ? BETWEEN startTime AND endTime";
        $params = [$storeId, date('N', strtotime($date)), $time]; 

        $result = $this->model->executeSQL($sql, 'obj', $params);
        return empty($result);
    }

    private function getAdminByStore($storeId) {
        // Lógica para obtener el admin asociado a la tienda
        return 'admin_id_o_nombre'; // Debes ajustar esto según tu lógica
    }
}
