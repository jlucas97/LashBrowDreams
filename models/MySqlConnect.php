<?php

class MySqlConnect
{
    private $result;
    private $sql;
    private $username;
    private $password;
    private $host;
    private $dbname;
    private $link;

    public function __construct()
    {
        // Connection parameters
        $this->username = 'root';
        $this->password = '123456';
        $this->host = 'localhost';
        $this->dbname = 'lashbrow_dreams';
    }

    /**
     * Establish connection
     */
    public function connect()
    {
        try {
            $this->link = new mysqli($this->host, $this->username, $this->password, $this->dbname);
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }
    /**
     * Execute a SQL sentence type Select
     * @param $sql - string SQL sentence 
     * @param $resultType - result type of the format tipo (obj,asoc,num)
     * @returns $resultType
     */
    //
    public function executeSQL($sql, $resultType = "obj")
    {
        $list = NULL;
        try {
            $this->connect();
            if ($result = $this->link->query($sql)) {
                for ($num_fila = $result->num_rows - 1; $num_fila >= 0; $num_fila--) {
                    $result->data_seek($num_fila);
                    switch ($resultType) {
                        case "obj":
                            $list[] = mysqli_fetch_object($result);
                            break;
                        case "asoc":
                            $list[] = mysqli_fetch_assoc($result);
                            break;
                        case "num":
                            $list[] = mysqli_fetch_row($result);
                            break;
                        default:
                            $list[] = mysqli_fetch_object($result);
                            break;
                    }
                }
            } else {
                throw new \Exception('Error: Execution sentence failed' . $this->link->errno . ' ' . $this->link->error);
            }
            $this->link->close();
            return $list;
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }
    /**
     * Execute a SQL sentence type Select INSERT,UPDATE
     * @param $sql - string SQL sentence 
     * @returns $num_result - number of results of the execution
     */
    //
    public function executeSQL_DML($sql)
    {
        $num_results = 0;
        $list = NULL;
        try {
            $this->connect();
            if ($result = $this->link->query($sql)) {
                $num_results = mysqli_affected_rows($this->link);
            }
            $this->link->close();
            return $num_results;
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }
    /**
     * Eexecute a SQL sentence type INSERT,UPDATE
     * @param $sql - string SQL sentence 
     * @returns $num_result- last inserted id
     */
    //
    public function executeSQL_DML_last($sql)
    {
        $num_results = 0;
        $list = NULL;
        try {
            $this->connect();
            if ($result = $this->link->query($sql)) {
                $num_results = $this->link->insert_id;
            }

            $this->link->close();
            return $num_results;
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }
}
