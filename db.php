<?php
$servername = "localhost";
$username = "root";
$password = "ShnayZoop11!";
$dbname = "proj_321";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $phone = $_POST["phone"];
    $email = $_POST["email"];
    $studentId = $_POST["student-id"];

    $stmt = $conn->prepare("INSERT INTO UserInfo (Phone, Email, StudentID) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $phone, $email, $studentId);

    if ($stmt->execute() === TRUE) {
        echo "Record inserted successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();


?>
