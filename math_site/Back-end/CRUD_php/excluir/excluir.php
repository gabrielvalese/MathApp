<?php
require_once("../config/config.php");
$cpf = $_POST['cpf'];


try{ 
    $delete = $mysqli->prepare("DELETE FROM  pessoas WHERE cpf = ?");
    $delete->bind_param("s", $cpf);
    $delete->execute();
    $delete->close();
    print("<p>Deu certo ! Pessoa deletada<br>");
    print('<a href="../config/index.html">Voltar ao menu</a>');
    } catch(Exception $erro) {
    error_log($e->getMessage());
    exit('Algo deu errado , tente novamente');
}







?>