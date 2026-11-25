<?php
require_once('config.php');
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['usuario']) || $_SESSION['tipo_conta'] !== 'estudante') {
    http_response_code(401);
    echo json_encode([]);
    exit;
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
        SELECT id, tempo_limite, numero_questoes, status, pontuacao,
               data_criacao, data_inicio, data_fim
        FROM simulado
        WHERE id_estudante = ?
        ORDER BY data_criacao DESC
        LIMIT 50
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
    echo json_encode(['erro' => 'Erro ao listar simulados.']);
}