<?php

class ProductModel
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
    public function getProducts()
    {
        try {
            //SQL Query
            $vSQL = "SELECT * from product order by price";
            //Query execution
            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }

    public function getProductById($id)
    {
        //last SQL sentencev $vSQL = "SELECT * FROM product WHERE id=$id";
        try {
            $vSQL = "SELECT 
            p.id, 
            p.name AS product_name, 
            p.description,
            p.price,
            p.usage,
            p.brand,
            c.name AS category_name, 
            s.name AS subcategory_name
        FROM 
            product p
        LEFT JOIN 
            category c ON p.categoryId = c.id
        LEFT JOIN 
            subcategory s ON p.subCategoryId = s.id
        WHERE
            p.id = $id";

            $vResult = $this->link->executeSQL($vSQL);
            if (!empty($vResult)) {
                //Get object
                $vResult = $vResult[0];
            }

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
