<?php
require_once __DIR__ . '/config.php';

$mysqli = conecta_banco();


$nome = $_POST['nome'];
$email = $_POST['email'];
$senha = password_hash($_POST['senha'], PASSWORD_BCRYPT);
$nascimento = $_POST['nascimento']; 
$tipo = $_POST['perfil'];
    
    if($tipo == "estudante") {
        try{ 
            $consulta = $mysqli->prepare("INSERT INTO Estudante (nome, email, nascimento, senha ) VALUES (?, ?, ?, ?)");
            $consulta->bind_param("ssss", $nome, $email, $nascimento, $senha);
            $consulta->execute();
            $consulta->close();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['sucesso' => true]);
            exit;
            } catch(Exception $erro) {
            error_log($erro->getMessage());
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['sucesso' => false]);
            exit;
    }

    } else {
        try{ 
            $consulta = $mysqli->prepare("INSERT INTO Professor (nome, email, senha, nascimento ) VALUES (?, ?, ?, ?)");
            $consulta->bind_param("ssss", $nome, $email, $senha, $nascimento);
            $consulta->execute();
            $consulta->close();
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['sucesso' => true]);
            } catch(Exception $erro) {
            error_log($erro->getMessage());
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['sucesso' => false]);
            exit;
    }
    }


?>