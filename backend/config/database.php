<?php
/**
 * Database Configuration 
 */

class Database {
    // private $host = "localhost";
    // private $port = "8889"; // Default MAMP MySQL port (change to 3306 if different)
    // private $db_name = "shopare";
    // private $username = "root";
    // private $password = "root"; // Default MAMP password

    private $host = "webtech_2025A_logan_anabi";
    private $port = "3306"; 
    private $db_name = "shopare";
    private $username = "logan.anabi";
    private $password = "Minushbest#0"; 


    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host .
                ";port=" . $this->port .
                ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
        }

        return $this->conn;
    }
}
