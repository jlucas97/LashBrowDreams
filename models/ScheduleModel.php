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
        $sql = "INSERT INTO schedule (idStore, dayOfWeek, startTime, endTime, type, recurrence, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->link->prepare($sql);
        $stmt->bind_param("iisssis", $data['idStore'], $data['dayOfWeek'], $data['startTime'], $data['endTime'], $data['type'], $data['recurrence'], $data['status']);
        return $stmt->execute();
    }

    public function updateSchedule($id, $data)
    {
        // Construye la consulta SQL para actualizar el horario
        $sql = "UPDATE schedule SET startTime = ?, endTime = ?, type = ? WHERE id = ?";

        $params = [
            $data['startTime'],
            $data['endTime'],
            $data['type'],
            $id
        ];

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

    // Definir el método getReservationsByDay en el modelo ScheduleModel
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
}
