<?php

class UserModel
{
    // Connect to DB
    public $link;

    public function __construct()
    {
        $this->link = new MySqlConnect();
    }

    public function getUsers()
    {
        try {
            // SQL Query
            $vSQL = "SELECT * 
                     FROM user 
                     order by email desc";

            $vResult = $this->link->executeSQL($vSQL);

            return $vResult;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
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

    public function getAdminByStore($storeId)
    {
        $sql = "SELECT u.* FROM user u
                INNER JOIN user_store us ON u.email = us.userEmail
                WHERE us.storeId = ?";
        $params = [$storeId];
        return $this->link->executeSQL($sql, 'obj', $params);
    }

    public function getUserByEmail($email)
    {
        try {
            $vSQL = "SELECT * FROM user WHERE email = ?";
            $params = [$email];
            $result = $this->link->executeSQL($vSQL, 'obj', $params);
            return $result ? $result[0] : null;
        } catch (Exception $e) {
            die("" . $e->getMessage());
        }
    }
}
