<?php
/* Configuração básica. Ajuste BASE_URL para o caminho da pasta no servidor (com barra final). */
const BASE_URL = '/mathema/';

function e(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function url(string $path): string { return BASE_URL . ltrim($path, '/'); }

?>

<?php
// // ========== Config ============
$_DB['server'] = 'localhost'; // Servidor MySQL
$_DB['user'] = 'root'; // Usuário MySQL
$_DB['password'] = '010910'; // Senha MySQL
$_DB['database'] = 'mathapp'; 
// ==============================

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try{
    $mysqli = new mysqli($_DB['server'], $_DB['user'], $_DB['password'], $_DB['database']);
    $mysqli->set_charset("utf8mb4");
} catch (Exception $e) {
    error_log($e->getMessage());
    exit($e);
}


?>
