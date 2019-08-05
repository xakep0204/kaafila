<?php

$srv_addr = 'localhost';
$user = 'dev';
$passwd = 'Apash0204@';
$db = 'c_register';
// Create Connection
$conn = new mysqli($srv_addr, $user, $passwd,$db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";


?>