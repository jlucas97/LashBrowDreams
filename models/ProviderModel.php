<?php

class ProviderModel
{
    //Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    /**
     * Get all Providers
     * @param
     * @return $vResult - List of object
     */
    public function getProviders()
    {
        try {
            //SQL Query
            $vSQL = "SELECT * from provider order by id desc";
            //Query execution
            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
