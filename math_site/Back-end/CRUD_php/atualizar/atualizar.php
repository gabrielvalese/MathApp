<?php
require_once("../config/config.php");
$cpf = $_POST['cpf'];
try{ 
    $consulta = $mysqli->prepare("SELECT * FROM pessoas WHERE cpf = ?");
    $consulta->bind_param("s", $cpf);
    $consulta->execute();
    $resultado = $consulta->get_result();
    $resultado = $resultado->fetch_all(MYSQLI_ASSOC);
    $sucesso = TRUE;
    } catch(Exception $erro) {
    error_log($e->getMessage());
    exit('Algo deu errado , tente novamente');
}
if($sucesso) {
    $nome = $resultado[0]['nome'];
    $email = $resultado[0]['email'];
    $cpf = $resultado[0]['cpf'];
    $nascimento = $resultado[0]['nascimento'];
    $senha = $resultado[0]['senha'];

?>
    <link rel="stylesheet" href="../config/style.css">
    <h1>Atualizar registro</h1>
    <p>Altere o registro da pesso cadastrada</p>
    <form action="salvar_alteracoes.php" method="post">
        <label for="nome">Nome</label>
        <input type="text" name="nome" value="<?php print($nome)?>">
        <label for="email">E-mail</label>
        <input type="email" name="email" id="email" value="<?php  print($email) ?>">
        <label for="cpf">CPF</label>
        <input type="text" name="cpf" id="cpf"  pattern="[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}" value="<?php print($cpf)?>" readonly>
        <label for="nascimento">Nascimento</label>
        <input type="date" name="nascimento" id="nascimento" value="<?php print($nascimento)?>">
        <label for="senha">Senha</label>
        <input type="password" name="senha" id="senha" placeholder="Nova senha">
        <button type="submit">Atualizar</button>
    </form>

<?php
}
?>