<?php

class schedule
{
    private $model;

    public function __construct()
    {
        $this->model = new ScheduleModel();
    }

    public function getSchedulesByStore($storeId)
    {
        $response = $this->model->getSchedulesByStore($storeId);
        if (empty($response)) {
            error_log('No schedules found for store ID: ' . $storeId);
        } else {
            error_log('Schedules found: ' . print_r($response, true));
        }
        echo json_encode($response);
    }

    public function getScheduleDetail($id)
    {
        $schedule = $this->model->getScheduleDetail($id);
        // Manejo de la respuesta aquí...
    }

    public function createSchedule($data)
    {
        $this->model->createSchedule($data);
        $this->fillScheduleGaps($data['idStore'], $data['dayOfWeek']);
    }

    public function fillScheduleGaps($idStore, $dayOfWeek)
{
    $schedules = $this->model->getSchedulesByDay($idStore, $dayOfWeek);
    $reservations = $this->model->getReservationsByDay($idStore, $dayOfWeek);

    $fullDayStart = '00:00:00';
    $fullDayEnd = '23:59:59';
    $lastEndTime = $fullDayStart;

    foreach ($schedules as $schedule) {
        if ($schedule['startTime'] > $lastEndTime) {
            // Verificamos si hay reservas en este intervalo
            $this->createBlockingEvents($idStore, $dayOfWeek, $lastEndTime, $schedule['startTime'], $reservations);
        }
        $lastEndTime = $schedule['endTime'];
    }

    if ($lastEndTime < $fullDayEnd) {
        $this->createBlockingEvents($idStore, $dayOfWeek, $lastEndTime, $fullDayEnd, $reservations);
    }
}

private function createBlockingEvents($idStore, $dayOfWeek, $startTime, $endTime, $reservations)
{
    $hasReservation = false;
    foreach ($reservations as $reservation) {
        if ($reservation['time'] >= $startTime && $reservation['time'] < $endTime) {
            $hasReservation = true;
            break;
        }
    }

    if (!$hasReservation) {
        $this->model->createSchedule([
            'idStore' => $idStore,
            'dayOfWeek' => $dayOfWeek,
            'startTime' => $startTime,
            'endTime' => $endTime,
            'type' => 'bloqueo',
            'recurrence' => 1,
            'status' => 'ocupado'
        ]);
    }
}


    // Método para actualizar un horario
    public function update($id)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->model->updateSchedule($id, $data);
            if ($result) {
                $schedule = $this->model->getScheduleDetail($id);
                $this->fillScheduleGaps($schedule['idStore'], $schedule['dayOfWeek']);
                echo json_encode(['status' => 200, 'result' => 'Schedule updated successfully']);
            } else {
                echo json_encode(['status' => 400, 'result' => 'Failed to update schedule']);
            }
        } else {
            echo json_encode(['status' => 405, 'result' => 'Method Not Allowed']);
        }
    }



    public function deleteSchedule($id)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $schedule = $this->model->getScheduleDetail($id);
            $result = $this->model->deleteSchedule($id);
            if ($result) {
                $this->fillScheduleGaps($schedule['idStore'], $schedule['dayOfWeek']);
                echo json_encode(['status' => 'success', 'message' => 'Horario eliminado']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el horario']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        }
    }
}
