<?php

class SubCategoryModel
{
    // Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getSubCategoriesByCategoryId($id)
    {
        try {
            // SQL Query
            $vSQL = "SELECT * FROM SubCategory WHERE categoryId = $id order by id desc";

            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
