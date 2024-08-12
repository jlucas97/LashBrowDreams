<?php

class MySqlConnect
{
    private $result;
    private $sql;
    private $username;
    private $password;
    private $host;
    private $dbname;
    public $link;  // Cambiado a público para acceso directo

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
            if ($this->link->connect_error) {
                throw new \Exception('Connect Error (' . $this->link->connect_errno . ') ' . $this->link->connect_error);
            }
            return $this->link;  // Retornar la conexión
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }

    public function prepare($sql)
    {
        $this->connect();
        $stmt = $this->link->prepare($sql);
        if ($stmt === false) {
            throw new \Exception('Prepare failed: (' . $this->link->errno . ') ' . $this->link->error);
        }
        return $stmt;
    }

    public function close()
    {
        $this->link->close();
    }

    /**
     * Execute a SQL sentence type Select
     * @param $sql - string SQL sentence 
     * @param $resultType - result type of the format tipo (obj,asoc,num)
     * @returns $resultType
     */
    public function executeSQL($sql, $resultType = "obj", $params = [])
    {
        $list = NULL;
        try {
            $this->connect();
            $stmt = $this->link->prepare($sql);
            if ($params) {
                $types = str_repeat('s', count($params));
                $stmt->bind_param($types, ...$params);
            }
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                while ($row = $result->fetch_assoc()) {
                    switch ($resultType) {
                        case "obj":
                            $list[] = (object)$row;
                            break;
                        case "asoc":
                            $list[] = $row;
                            break;
                        case "num":
                            $list[] = array_values($row);
                            break;
                        default:
                            $list[] = (object)$row;
                            break;
                    }
                }
            } else {
                throw new \Exception('Error: Execution sentence failed' . $this->link->errno . ' ' . $this->link->error);
            }
            $stmt->close();
            $this->link->close();
            return $list;
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }

    /**
     * Execute a SQL sentence type INSERT, UPDATE
     * @param $sql - string SQL sentence 
     * @returns $num_result - number of results of the execution
     */
    public function executeSQL_DML($sql, $params = [])
    {
        $num_results = 0;
        try {
            $this->connect();
            $stmt = $this->link->prepare($sql);
            if ($params) {
                $types = str_repeat('s', count($params));
                $stmt->bind_param($types, ...$params);
            }
            if ($stmt->execute()) {
                $num_results = $stmt->affected_rows;
            }
            $stmt->close();
            $this->close();
            return $num_results;
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }

    /**
     * Execute a SQL sentence type INSERT, UPDATE
     * @param $sql - string SQL sentence 
     * @returns $num_result - last inserted id
     */
    public function executeSQL_DML_last($sql, $params = [])
    {
        $num_results = 0;
        try {
            $this->connect();
            $stmt = $this->link->prepare($sql);
            if ($params) {
                $types = str_repeat('s', count($params));
                $stmt->bind_param($types, ...$params);
            }
            if ($stmt->execute()) {
                $num_results = $stmt->insert_id;
            }
            $stmt->close();
            $this->close();
            return $num_results;
        } catch (Exception $e) {
            throw new \Exception('Error: ' . $e->getMessage());
        }
    }
}
