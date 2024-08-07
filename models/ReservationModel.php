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
}
