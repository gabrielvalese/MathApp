<?php
require_once('config.php');
session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'erro' => 'Método não permitido.']);
    exit;
}
if (!isset($_SESSION['usuario'], $_SESSION['tipo_conta']) || $_SESSION['tipo_conta'] !== 'estudante') {
    http_response_code(401);
    echo json_encode(['sucesso' => false, 'erro' => 'Sessão inválida.']);
    exit;
}

// ---------- Coleta e validação ----------
$conteudos_raw = $_POST['conteudos'] ?? [];
$conteudos = [];
foreach ((array)$conteudos_raw as $c) {
    $id = filter_var($c, FILTER_VALIDATE_INT);
    if ($id !== false) $conteudos[] = $id;
}

$numero = filter_input(INPUT_POST, 'numero_questoes', FILTER_VALIDATE_INT);
$tempo  = filter_input(INPUT_POST, 'tempo_limite',    FILTER_VALIDATE_INT);

if (!$numero || $numero < 1 || $numero > 100) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'erro' => 'Número de questões inválido.']);
    exit;
}
if (!$tempo || $tempo < 1 || $tempo > 180) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'erro' => 'Tempo limite inválido (1 a 180 min).']);
    exit;
}

try {
    $mysqli = conecta_banco();

    // ---------- ID do estudante ----------
    $stmt = $mysqli->prepare("SELECT id FROM Estudante WHERE email = ?");
    $stmt->bind_param('s', $_SESSION['usuario']);
    $stmt->execute();
    $estudante = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$estudante) {
        http_response_code(401);
        echo json_encode(['sucesso' => false, 'erro' => 'Estudante não encontrado.']);
        exit;
    }
    $id_estudante = (int)$estudante['id'];

    // ---------- Sorteia questões ----------
    $sql = "SELECT id FROM questao";
    $params = [];
    $types  = '';

    if (!empty($conteudos)) {
        $placeholders = implode(',', array_fill(0, count($conteudos), '?'));
        $sql .= " WHERE id_conteudo IN ($placeholders)";
        $types  = str_repeat('i', count($conteudos));
        $params = $conteudos;
    }
    $sql .= " ORDER BY RAND() LIMIT " . (int)$numero;

    $stmt = $mysqli->prepare($sql);
    if (!empty($params)) $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $questoes = [];
    while ($row = $result->fetch_assoc()) $questoes[] = (int)$row['id'];
    $stmt->close();

    if (count($questoes) === 0) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Nenhuma questão encontrada para os filtros.']);
        exit;
    }

    // ---------- Cria simulado ----------
    $mysqli->begin_transaction();

    $stmt = $mysqli->prepare(
        "INSERT INTO simulado (tempo_limite, numero_questoes, id_estudante, status, data_criacao)
         VALUES (?, ?, ?, 'criado', NOW())"
    );
    $stmt->bind_param('iii', $tempo, $numero, $id_estudante);
    $stmt->execute();
    $id_simulado = $stmt->insert_id;
    $stmt->close();

    $stmt = $mysqli->prepare(
        "INSERT INTO simulado_questao (id_questao, id_simulado, ordem) VALUES (?, ?, ?)"
    );
    foreach ($questoes as $i => $qid) {
        $ordem = $i + 1;
        $stmt->bind_param('iii', $qid, $id_simulado, $ordem);
        $stmt->execute();
    }
    $stmt->close();

    $mysqli->commit();

    echo json_encode([
        'sucesso'     => true,
        'id_simulado' => $id_simulado,
        'total'       => count($questoes),
    ]);
} catch (Throwable $e) {
    if (isset($mysqli)) $mysqli->rollback();
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => 'Erro ao criar simulado.']);
}