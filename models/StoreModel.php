<?php

class StoreModel
{
    // Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getStores()
    {
        try {
            // SQL Query
            $vSQL = "SELECT * FROM Store order by id desc";

            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
