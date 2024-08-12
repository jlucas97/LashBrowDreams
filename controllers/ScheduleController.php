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
        // Validaciones de sobreposición y fechas aquí...
        $result = $this->model->createSchedule($data);
        // Manejo de la respuesta aquí...
    }

    // Método para actualizar un horario
    public function update($id)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            // Lógica para actualizar el registro con el ID recibido
            $data = json_decode(file_get_contents("php://input"), true); // Capturar el cuerpo de la solicitud
            // Realizar la actualización utilizando el modelo y $id
            $result = $this->model->updateSchedule($id, $data);

            if ($result) {
                echo json_encode(['status' => 200, 'result' => 'Schedule updated successfully']);
            } else {
                echo json_encode(['status' => 400, 'result' => 'Failed to update schedule']);
            }
        } else {
            echo json_encode(['status' => 405, 'result' => 'Method Not Allowed']);
        }
    }



    // Método para eliminar un horario
    public function deleteSchedule($id)
    {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $result = $this->model->deleteSchedule($id);
            if ($result) {
                echo json_encode(['status' => 'success', 'message' => 'Horario eliminado']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el horario']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        }
    }
}
