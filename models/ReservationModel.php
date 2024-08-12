<?php

class ReservationModel {
    private $link;

    public function __construct() {
        $this->link = new MySqlConnect();
    }

    public function getReservations($storeId, $admin = null, $customerId = null, $date = null) {
        $sql = "SELECT id, customerId, storeId, serviceId, date, time, admin, status FROM reservation WHERE storeId = ?";
        $params = [$storeId];

        if ($admin) {
            $sql .= " AND admin = ?";
            $params[] = $admin;
        }

        if ($customerId) {
            $sql .= " AND customerId LIKE ?";
            $params[] = "%" . $customerId . "%";
        }

        if ($date) {
            $sql .= " AND date = ?";
            $params[] = $date;
        }

        return $this->link->executeSQL($sql, 'obj', $params);
    }

    public function getReservationById($id) {
        $sql = "SELECT id, customerId, storeId, serviceId, date, time, admin, status FROM reservation WHERE id = ?";
        $params = [$id];
        return $this->link->executeSQL($sql, 'obj', $params);
    }

    public function createReservation($data) {
        $sql = "INSERT INTO reservation (customerId, storeId, serviceId, date, time, admin, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data['customerId'],
            $data['storeId'],
            $data['serviceId'],
            $data['date'],
            $data['time'],
            $data['admin'],
            $data['status']
        ];
        return $this->link->executeSQL($sql, 'insert', $params);
    }

    public function executeSQL($sql, $type = 'obj', $params = []) {
        $stmt = $this->link->prepare($sql);
        $stmt->execute($params);
        
        switch ($type) {
            case 'obj':
                return $stmt->fetchAll(PDO::FETCH_OBJ);
            case 'insert':
                return $stmt->rowCount() > 0;
            default:
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

}
