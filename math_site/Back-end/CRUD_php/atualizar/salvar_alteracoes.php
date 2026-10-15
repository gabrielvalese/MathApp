<?php
require_once("../config/config.php");
$nome_atualizado = $_POST['nome'];
$email_atualizado = $_POST['email'];
$nascimento_atualizado = $_POST['nascimento'];
$hash = password_hash($_POST['senha'], PASSWORD_BCRYPT);
$cpf = $_POST['cpf'];
try{ 
    $consulta = $mysqli->prepare("UPDATE pessoas SET nome = ? , email = ?, senha = ? , nascimento = ? WHERE cpf = ?");
    $consulta->bind_param("sssss",$nome_atualizado, $email_atualizado, $hash, $nascimento_atualizado, $cpf);
    $consulta->execute();
    print("Pessoa Atualizada<br>");
        print('<a href="../config/index.html">Voltar ao menu</a>');
    } catch(Exception $erro) {
    error_log($erro->getMessage());
    exit('Algo deu errado , tente novamente');


}