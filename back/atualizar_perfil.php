<?php
require_once ('config.php');

session_start();
header('Content-Type: application/json; charset=utf-8');

function atualizar_perfil($campo, $valor) {
    $email = $_SESSION['usuario'] ?? '';
    $perfil = $_SESSION['tipo_conta'] ?? '';

    if ($email === '' || !is_string($valor)) {
        return false;
    }

    if ($perfil === 'estudante') {
        $tabela = 'Estudante';
    } elseif ($perfil === 'professor') {
        $tabela = 'Professor';
    } else {
        return false;
    }

    $valor = trim($valor);

    if ($campo === 'nome') {
        if ($valor === '') {
            return false;
        }
    } elseif ($campo === 'nascimento') {
        $data = DateTimeImmutable::createFromFormat('!Y-m-d', $valor);
        if (!$data || $data->format('Y-m-d') !== $valor) {
            return false;
        }
    } else {
        return false;
    }

    try {
        $mysqli = conecta_banco();
        $consulta = $mysqli->prepare("UPDATE `$tabela` SET `$campo` = ? WHERE email = ?");
        $consulta->bind_param('ss', $valor, $email);
        $salvou = $consulta->execute();
        $consulta->close();

        return $salvou;
    } catch (mysqli_sql_exception $erro) {
        error_log($erro->getMessage());
        return false;
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false]);
    exit;
}

$campo = $_POST['campo'] ?? '';
$valor = $_POST['valor'] ?? '';

echo json_encode(['sucesso' => atualizar_perfil($campo, $valor)]);