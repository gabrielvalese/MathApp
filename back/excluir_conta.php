<?php
require_once("config.php");

session_start();

header('Content-Type: application/json; charset=utf-8');

function deletar_conta() {
    $mysqli = conecta_banco();
    $perfil = $_SESSION['tipo_conta'] ?? '';
    $usuario = $_SESSION['usuario'] ?? '';
    
    if ($usuario === '') {
        return false;
    }



    if ($perfil === 'estudante') {
        $tabela = 'Estudante';
    } elseif ($perfil === 'professor') {
        $tabela = 'Professor';
    }  else {
        return false;
    }

     try{ 
        $delete = $mysqli->prepare("DELETE FROM `$tabela` WHERE email = ?");
        $delete->bind_param("s", $usuario);
        $delete->execute();
        $excluiu = $delete->affected_rows > 0;
        $delete->close();
        return $excluiu;
    } catch (Exception $erro) {
        error_log($erro->getMessage());
        return false;
    }


}

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false]);
    exit;
    }

    
    if (!deletar_conta()) {
    echo json_encode(['sucesso' => false]);
    exit;
    }


    $_SESSION = [];
    session_destroy();

    echo json_encode(['sucesso' => true]);


?>