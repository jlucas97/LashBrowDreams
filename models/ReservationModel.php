<?php

class ReservationModel
{
    //Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getReservations($id)
    {
        try {
            //SQL Query
            $vSQL = "SELECT r.id as ID, r.date as Fecha, u.name as cliente, r.time as hora, se.name as servicio,
                    s.name as tienda, r.status, r.admin as admin
                    from reservation as r
                    Inner Join user as u on u.email = r.customerId
                    Inner Join store as s on s.id = r.storeId
                    Inner Join service as se on se.id = serviceId
                    Where s.id = $id
                    Order by r.ID desc";


            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }

    public function getReservationByStoreAndUser($idStore, $idUser)
    {
        try {
            //SQL Query
            $vSQL = "SELECT r.id as ID, r.date as Fecha, u.name as cliente, r.time as hora, se.name as servicio,
                    s.name as tienda, r.status, r.admin as admin
                    from reservation as r
                    Inner Join user as u on u.email = r.customerId
                    Inner Join store as s on s.id = r.storeId
                    Inner Join service as se on se.id = serviceId
                    Where s.id = $idStore AND u.email = '$idUser'
                    Order by r.ID desc";


            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
