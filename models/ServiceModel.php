<?php

class ServiceModel
{
    //Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getServices()
    {
        try {
            //SQL Query
            $vSQL = "SELECT s.id as id, s.name as Nombre, s.description as Descripcion, s.price as Precio, s.time as Duracion, c.name as Categoria, t.name as Tipo
                    FROM service as s
                    Inner Join category as c on s.categoryId = c.id
                    Inner Join type as t on s.typeId = t.id
                    Order by s.ID desc";


            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }

    public function getServiceById($id)
    {
        try {
            //SQL Query
            $vSQL = "SELECT s.id as ID, s.name as Nombre, s.description as Descripcion, s.price as Precio, s.time as Duracion, c.name as Categoria, t.name as Tipo
                    FROM service as s
                    Inner Join category as c on s.categoryId = c.id
                    Inner Join type as t on s.typeId = t.id
                    Where s.Id = $id
                    Order by s.ID desc";


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

    public function create($object)
    {
        try {

            $sql = "INSERT INTO product
            (name, description, unitPrice, sku, yearMade, model, idCategory, idSubCategory) 
            VALUES 
            ('$object->name', '$object->description', $object->unitPrice, '$object->sku', $object->yearMade, '$object->model', $object->idCategory, $object->idSubCategory)";

            //Get last insert
            $idProduct = $this->link->executeSQL_DML_last($sql);

            //Create Category
            foreach ($object->categories as $item) {
                $sql = "INSERT INTO category
                (id,
                name)" .
                    "VALUES
                ('$item->categoryId',
                '$item->name')";
                $vResultC = $this->link->executeSQL_DML_last($sql);
            }

            //Create SubCategory
            foreach ($object->categories as $item) {
                $sql = "INSERT INTO subcategory
                (id,
                categoryId,
                name)" .
                    "VALUES
                ('$item->subCategoryId',
                '$item->categoryId',
                '$item->name')";
                $vResultS = $this->link->executeSQL_DML_last($sql);
            }

            //Return product
            return $this->getServiceById($idProduct);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
}
