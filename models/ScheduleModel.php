<?php

class ScheduleModel
{
    private $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getSchedulesByStore($storeId)
    {
        $sql = "SELECT * FROM schedule WHERE idStore = ?";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("i", $storeId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getScheduleDetail($id)
    {
        $sql = "SELECT * FROM schedule WHERE id = ?";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function createSchedule($data)
    {
        $sql = "INSERT INTO schedule (idStore, dayOfWeek, startTime, endTime, type, recurrence, status) VALUES (?, ?, ?, ?, ?, 1, ?)";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("iissss", $data['idStore'], $data['dayOfWeek'], $data['startTime'], $data['endTime'], $data['type'], $data['status']);
        return $stmt->execute();
    }

    public function updateSchedule($id, $data)
    {
        if (!isset($data['startTime']) || !isset($data['endTime'])) {
            throw new Exception("Los valores de inicio y fin son necesarios");
        }

        $sql = "UPDATE schedule SET startTime = ?, endTime = ?, type = ? WHERE id = ?";
        $params = [$data['startTime'], $data['endTime'], $data['type'], $id];
        return $this->link->executeSQL($sql, 'update', $params);
    }

    public function deleteSchedule($id)
    {
        $sql = "DELETE FROM schedule WHERE id = ?";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function getSchedulesByDay($idStore, $dayOfWeek)
    {
        $sql = "SELECT * FROM schedule WHERE idStore = ? AND dayOfWeek = ? ORDER BY startTime ASC";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("ii", $idStore, $dayOfWeek);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getReservationsByDay($storeId, $dayOfWeek)
    {
        $sql = "
        SELECT r.*
        FROM reservation r
        JOIN schedule s ON r.storeId = s.idStore
        WHERE r.storeId = ? AND WEEKDAY(r.date) = ?
    ";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("ii", $storeId, $dayOfWeek);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getBlockingsByTimeRange($idStore, $dayOfWeek, $startTime, $endTime)
    {
        $sql = "
            SELECT * FROM schedule
            WHERE idStore = ? AND dayOfWeek = ? AND type = 'bloqueo'
            AND (
                (startTime < ? AND endTime > ?) OR 
                (startTime >= ? AND startTime < ?)
            )
        ";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("iissss", $idStore, $dayOfWeek, $endTime, $startTime, $startTime, $endTime);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}