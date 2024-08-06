<?php

class reservation
{
    //Get all Categories
    public function index($id)
    {
        //Category instance
        $reservationM = new ReservationModel;
        //Model method
        $response = $reservationM->getReservations($id);

        if (isset($response) && !empty($response)) {
            $json = array(
                'status' => 200,
                'results' => $response
            );
        } else {
            $json = array(
                'status' => 400,
                'results' => "No entries"
            );
        }
        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }

    public function get($idStore,$idUser){
        //Reservation instance
        $reservationM = new ReservationModel;
        //Model method
        $response = $reservationM->getReservationByStoreAndUser($idStore,$idUser);

        if (isset($response) && !empty($response)) {
            $json = array(
                'status' => 200,
                'results' => $response
            );
        } else {
            $json = array(
                'status' => 400,
                'results' => "No entries"
            );
        }
        echo json_encode(
            $json,
            http_response_code($json["status"])
        );
    }
}
