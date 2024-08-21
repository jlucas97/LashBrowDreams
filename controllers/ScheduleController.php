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
        echo json_encode($response);
    }

    public function getScheduleDetail($id)
    {
        $schedule = $this->model->getScheduleDetail($id);
        echo json_encode($schedule);
    }

    public function createSchedule()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $this->model->createSchedule($data);
            $this->adjustBlockingsAfterScheduleChange($data['idStore'], $data['dayOfWeek']);
            echo json_encode(['status' => 200, 'result' => 'Schedule created successfully']);
        } else {
            echo json_encode(['status' => 405, 'result' => 'Method Not Allowed']);
        }
    }

    public function update($id)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents("php://input"), true);
            $originalSchedule = $this->model->getScheduleDetail($id);
            $result = $this->model->updateSchedule($id, $data);

            if ($result) {
                $this->adjustBlockingsAfterScheduleUpdate($originalSchedule, $data);
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
            if ($schedule) {
                $result = $this->model->deleteSchedule($id);
                if ($result) {
                    echo json_encode(['status' => 'success', 'message' => 'Horario eliminado']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el horario']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Horario no encontrado']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        }
    }

    private function adjustBlockingsAfterScheduleChange($idStore, $dayOfWeek)
    {
        $schedules = $this->model->getSchedulesByDay($idStore, $dayOfWeek);
        usort($schedules, function ($a, $b) {
            return strtotime($a['startTime']) - strtotime($b['startTime']);
        });

        $fullDayStart = '00:00:00';
        $fullDayEnd = '23:59:59';
        $lastEndTime = $fullDayStart;

        foreach ($schedules as $schedule) {
            if ($schedule['startTime'] > $lastEndTime) {
                $this->createOrUpdateBlocking($idStore, $dayOfWeek, $lastEndTime, $schedule['startTime']);
            }

            if ($schedule['type'] === 'bloqueo') {
                if ($schedule['startTime'] > $lastEndTime) {
                    $result = $this->model->updateSchedule($schedule['id'], [
                        'endTime' => $lastEndTime
                    ]);

                    if (!$result) {
                        return;
                    }

                    $newBlockingId = $this->model->createSchedule([
                        'idStore' => $idStore,
                        'dayOfWeek' => $dayOfWeek,
                        'startTime' => $lastEndTime,
                        'endTime' => $schedule['endTime'],
                        'type' => 'bloqueo',
                        'recurrence' => 1,
                        'status' => 'ocupado'
                    ]);

                    if (!$newBlockingId) {
                        return;
                    }
                }
            }

            $lastEndTime = $schedule['endTime'];
        }

        if ($lastEndTime < $fullDayEnd) {
            $this->createOrUpdateBlocking($idStore, $dayOfWeek, $lastEndTime, $fullDayEnd);
        }
    }

    private function adjustBlockingsAfterScheduleUpdate($originalSchedule, $updatedSchedule)
    {
        $idStore = $originalSchedule['idStore'];
        $dayOfWeek = $originalSchedule['dayOfWeek'];

        $schedules = $this->model->getSchedulesByDay($idStore, $dayOfWeek);

        foreach ($schedules as $schedule) {
            if ($schedule['type'] === 'bloqueo') {
                $this->model->deleteSchedule($schedule['id']);
            }
        }

        $this->fillScheduleGaps($idStore, $dayOfWeek);
    }

    private function createOrUpdateBlocking($idStore, $dayOfWeek, $startTime, $endTime)
    {
        $existingBlockings = $this->model->getBlockingsByTimeRange($idStore, $dayOfWeek, $startTime, $endTime);

        if (empty($existingBlockings)) {
            $this->model->createSchedule([
                'idStore' => $idStore,
                'dayOfWeek' => $dayOfWeek,
                'startTime' => $startTime,
                'endTime' => $endTime,
                'type' => 'bloqueo',
                'recurrence' => 1,
                'status' => 'ocupado'
            ]);
        } else {
            foreach ($existingBlockings as $blocking) {
                $newStartTime = min($blocking['startTime'], $startTime);
                $newEndTime = max($blocking['endTime'], $endTime);
                $this->model->updateSchedule($blocking['id'], [
                    'startTime' => $newStartTime,
                    'endTime' => $newEndTime,
                    'type' => 'bloqueo'
                ]);
            }
        }
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
                $this->createBlockingEventIfNoReservation($idStore, $dayOfWeek, $lastEndTime, $schedule['startTime'], $reservations);
            }
            $lastEndTime = $schedule['endTime'];
        }

        if ($lastEndTime < $fullDayEnd) {
            $this->createBlockingEventIfNoReservation($idStore, $dayOfWeek, $lastEndTime, $fullDayEnd, $reservations);
        }
    }

    private function createBlockingEventIfNoReservation($idStore, $dayOfWeek, $startTime, $endTime, $reservations)
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
}