<?php
require_once("../config/config.php");
$nome = $_POST['nome'];
$email = $_POST['email'];
$nascimento = $_POST['nascimento'];
$cpf = $_POST['cpf'];
$hash = password_hash($_POST['senha'], PASSWORD_BCRYPT);

try{ 
    $consulta = $mysqli->prepare("INSERT INTO pessoas (nome, email, nascimento, cpf, senha ) VALUES (?, ?, ?, ?, ?)");
    $consulta->bind_param("sssss", $nome, $email, $nascimento, $cpf, $hash);
    $consulta->execute();
    $consulta->close();
    print("<p>Deu certo ! Pessoa cadastrada<br>");
    print('<a href="../config/index.html">Voltar ao menu</a>');
    } catch(Exception $erro) {
    error_log($erro->getMessage());
    exit('Algo deu errado , tente novamente');
    }





?>