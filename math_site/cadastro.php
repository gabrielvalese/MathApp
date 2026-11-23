<?php
require_once('config.php');
$nome = $_POST['nome'];
$email = $_POST['email'];
$senha = password_hash($_POST['senha'], PASSWORD_BCRYPT);
$nascimento = $_POST['nascimento']; 
$tipo = $_POST['tipo_conta'];

try{ 
    $consulta = $mysqli->prepare("INSERT INTO Usuario (nome, email, senha, nascimento ) VALUES (?, ?, ?, ?)");
    $consulta->bind_param("ssss", $nome, $email, $senha, $nascimento);
    $consulta->execute();
    $consulta->close();
    print("<p>Deu certo ! Pessoa cadastrada<br>");
    } catch(Exception $erro) {
    error_lg($erro->getMessage());
    exit('Algo deu errado , tente novamente');
    }
    if($tipo == "aluno") {
        try{ 
            $consulta = $mysqli->prepare("INSERT INTO Usuario (nome, email, senha, nascimento ) VALUES (?, ?, ?, ?)");
            $consulta->bind_param("ssss", $nome, $email, $senha, $nascimento);
            $consulta->execute();
            $consulta->close();
            print("<p>Deu certo ! Pessoa cadastrada<br>");
            } catch(Exception $erro) {
            error_log($erro->getMessage());
            exit('Algo deu errado , tente novamente');
    }

    }


?>



