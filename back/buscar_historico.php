<?php
require_once('config.php');
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario']) || $_SESSION['tipo_conta'] !== 'estudante') {
    http_response_code(401); echo json_encode([]); exit;
}

try {
    $mysqli = conecta_banco();

    $stmt = $mysqli->prepare("SELECT id FROM Estudante WHERE email = ?");
    $stmt->bind_param('s', $_SESSION['usuario']);
    $stmt->execute();
    $estudante = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$estudante) { http_response_code(401); echo json_encode([]); exit; }

    $stmt = $mysqli->prepare("
        SELECT eq.id, eq.id_questao, eq.id_simulado, eq.acerto, eq.resposta,
               eq.data_realizacao, q.id_conteudo, c.nome AS conteudo
        FROM estudante_questao eq
        INNER JOIN questao q  ON q.id = eq.id_questao
        INNER JOIN conteudo c ON c.id = q.id_conteudo
        WHERE eq.id_estudante = ?
        ORDER BY eq.data_realizacao DESC
        LIMIT 200
    ");
    $stmt->bind_param('i', $estudante['id']);
    $stmt->execute();
    $res = $stmt->get_result();

    $out = [];
    while ($row = $res->fetch_assoc()) $out[] = $row;
    $stmt->close();

    echo json_encode($out);
} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar histórico.']);
}