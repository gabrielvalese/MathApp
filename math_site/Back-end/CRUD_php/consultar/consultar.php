<?php
require_once("../config/config.php");
$acao = $_POST['acao'] ?? '';
if($acao == 'Pessoa específica') {
    if (!isset($_POST['cpf'])) {
    ?>
    <form action="consultar.php" method="post">
    <label for="visualizar">CPF</label>
    <input type="text" name="cpf" id="cpf" pattern="[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}" placeholder="123.456.789-99">
    <input type="hidden" name="acao" value="Pessoa específica">
    <button type="submit">Enviar</button>
    </form>
    <?php
    exit;
    }
    
    $cpf = $_POST['cpf'];
    try{ 
    $consulta = $mysqli->prepare("SELECT * FROM pessoas WHERE cpf = ? ");
    $consulta->bind_param("s", $cpf);
    $consulta->execute();
    } catch(Exception $erro) {
    error_log($erro->getMessage());
    exit('Algo deu errado , tente novamente');
    }
    $resultado = $consulta->get_result();
    $resultadoFormatado = $resultado->fetch_all(MYSQLI_ASSOC);
    echo "<table><tr><th>CPF</th><th>NOME</th><th>EMAIL</th><th>NASCIMENTO</th></tr>";
    foreach ($resultadoFormatado as $linha) {
    echo "<tr><td>" . $linha['cpf'] . "</td><td>" . $linha['nome'] . "</td> <td>" . $linha['email'] . "</td> <td>" . $linha['nascimento'] . "</td></tr>";
    }
    echo "</table><br>";
        print('<a href="../config/index.html">Voltar ao menu</a>');

}else {
    try{ 
    $consulta = $mysqli->prepare("SELECT * FROM pessoas");
    $consulta->execute();
    } catch(Exception $erro) {
    error_log($e->getMessage());
    exit('Algo deu errado , tente novamente');
    }
    $resultado = $consulta->get_result();
    $resultadoFormatado = $resultado->fetch_all(MYSQLI_ASSOC);

    echo "<table><tr><th>CPF</th><th>NOME</th><th>EMAIL</th><th>NASCIMENTO</th></tr>";
    foreach ($resultadoFormatado as $linha) {
    echo "<tr><td>" . $linha['cpf'] . "</td><td>" . $linha['nome'] . "</td> <td>" . $linha['email'] . "</td> <td>" . $linha['nascimento'] . "</td></tr>";
    }
    echo "</table><br>";
    print('<a href="../config/index.html">Voltar ao menu</a>');


}





?>