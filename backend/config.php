<?php
// Credenciales de la base de datos
// Por seguridad no guardamos credenciales en texto plano aquí.
// Se intentan leer desde variables de entorno; si no están
// definidas, se usan valores marcados como 'REDACTED'.
$host = getenv('DB_HOST') ?: 'localhost';
$db = getenv('DB_NAME') ?: 'REDACTED_DB_NAME';
$user = getenv('DB_USER') ?: 'REDACTED_DB_USER';
$pass = getenv('DB_PASSWORD') ?: 'REDACTED_DB_PASSWORD';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // En producción no mostrar errores reales al usuario
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}
?>