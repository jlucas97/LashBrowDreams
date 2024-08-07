<?php

class UserModel
{
    // Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getUsersById($id)
    {
        try {
            // SQL Query
            $vSQL = "SELECT * 
                     FROM user 
                     Where email like '$id%'
                     order by email desc";

            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
