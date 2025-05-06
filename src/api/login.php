<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$db = "nom_de_ta_base";
$user = "root";
$pass = ""; // ou ton mot de passe MySQL

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion DB"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["email"] ?? "";
$password = $data["password"] ?? "";

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user["password"])) {
    echo json_encode([
        "success" => true,
        "role" => $user["role"]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Email ou mot de passe incorrect"
    ]);
}
?>
