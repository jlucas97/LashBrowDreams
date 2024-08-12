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
}
