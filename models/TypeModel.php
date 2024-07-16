<?php

class TypeModel
{
    //Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getTypes()
    {
        try {
            //SQL Query
            $vSQL = "SELECT * FROM type order by id desc";


            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
