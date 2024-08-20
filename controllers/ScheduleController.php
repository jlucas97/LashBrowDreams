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
                // Verificar si hay reservas en este intervalo
                $hasReservation = false;
                foreach ($reservations as $reservation) {
                    if ($reservation['time'] >= $lastEndTime && $reservation['time'] < $schedule['startTime']) {
                        $hasReservation = true;
                        break;
                    }
                }
    
                // Crear un bloque solo si no hay reservas en este intervalo
                if (!$hasReservation) {
                    $this->model->createSchedule([
                        'idStore' => $idStore,
                        'dayOfWeek' => $dayOfWeek,
                        'startTime' => $lastEndTime,
                        'endTime' => $schedule['startTime'],
                        'type' => 'bloqueo',
                        'recurrence' => 1,
                        'status' => 'ocupado'
                    ]);
                }
            }
    
            // Actualizar el tiempo final del último horario procesado
            $lastEndTime = $schedule['endTime'];
        }
    
        // Crear un bloque para el tiempo restante del día si no hay reservas
        if ($lastEndTime < $fullDayEnd) {
            $hasReservation = false;
            foreach ($reservations as $reservation) {
                if ($reservation['time'] >= $lastEndTime && $reservation['time'] < $fullDayEnd) {
                    $hasReservation = true;
                    break;
                }
            }
    
            if (!$hasReservation) {
                $this->model->createSchedule([
                    'idStore' => $idStore,
                    'dayOfWeek' => $dayOfWeek,
                    'startTime' => $lastEndTime,
                    'endTime' => $fullDayEnd,
                    'type' => 'bloqueo',
                    'recurrence' => 1,
                    'status' => 'ocupado'
                ]);
            }
        }
    }
    

    private function createBlockingEvents($idStore, $dayOfWeek, $startTime, $endTime)
    {
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



    public function update($id)
{
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $data = json_decode(file_get_contents("php://input"), true);

        // Guardar el horario actual antes de la actualización
        $originalSchedule = $this->model->getScheduleDetail($id);

        // Actualizar el horario
        $result = $this->model->updateSchedule($id, $data);

        if ($result) {
            // Ajustar los bloqueos en torno a este horario
            $this->adjustBlockingsAfterScheduleUpdate($originalSchedule, $data);
            echo json_encode(['status' => 200, 'result' => 'Schedule updated successfully']);
        } else {
            echo json_encode(['status' => 400, 'result' => 'Failed to update schedule']);
        }
    } else {
        echo json_encode(['status' => 405, 'result' => 'Method Not Allowed']);
    }
}

private function adjustBlockingsAfterScheduleUpdate($originalSchedule, $updatedSchedule)
{
    $idStore = $originalSchedule['idStore'];
    $dayOfWeek = $originalSchedule['dayOfWeek'];

    // Obtener todos los horarios y bloqueos del día
    $schedules = $this->model->getSchedulesByDay($idStore, $dayOfWeek);

    // Eliminar todos los bloqueos existentes en este día
    foreach ($schedules as $schedule) {
        if ($schedule['type'] === 'bloqueo') {
            $this->model->deleteSchedule($schedule['id']);
        }
    }

    // Rellenar los bloqueos después de la actualización
    $this->fillScheduleGaps($idStore, $dayOfWeek);
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
