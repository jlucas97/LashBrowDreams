<?php

class CategoryModel
{
    //Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getCategories()
    {
        try {
            //SQL Query
            $vSQL = "SELECT * FROM Category order by id desc";


            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }

    public function getCategoryById($id)
    {
        try {
            //SQL Query
            $vSQL = "SELECT * FROM Category Where id = $id order by id desc";
            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
