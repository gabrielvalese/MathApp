<?php
require_once ('seguranca.php');

$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$lembrar = isset($_POST['lembrar']);
$perfil = $_POST['perfil'] ?? '';
header('Content-Type: application/json; charset=utf-8');

if (validaUsuario($email, $senha, $perfil)) {
    session_regenerate_id(true);
    if ($lembrar) {
    $opcoes = session_get_cookie_params();
    unset($opcoes['lifetime']);
    $opcoes['expires'] = time() + 2592000;

    setcookie(session_name(), session_id(), $opcoes);
}
    echo json_encode(['sucesso' => true]);
    exit;
}

http_response_code(401);
  echo json_encode([
        'sucesso' => false,
    ]);
    exit;
exit;
?>