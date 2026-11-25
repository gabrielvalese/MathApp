<?php
require_once('config.php');
session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['sucesso'=>false]); exit; }
if (!isset($_SESSION['usuario']) || $_SESSION['tipo_conta'] !== 'estudante') {
    http_response_code(401); echo json_encode(['sucesso'=>false]); exit;
}

$id_simulado = filter_input(INPUT_POST, 'id_simulado', FILTER_VALIDATE_INT);
if (!$id_simulado) { http_response_code(400); echo json_encode(['sucesso'=>false]); exit; }

try {
    $mysqli = conecta_banco();

    $stmt = $mysqli->prepare("SELECT id FROM Estudante WHERE email = ?");
    $stmt->bind_param('s', $_SESSION['usuario']);
    $stmt->execute();
    $estudante = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$estudante) { http_response_code(401); echo json_encode(['sucesso'=>false]); exit; }
    $id_estudante = (int)$estudante['id'];

    $stmt = $mysqli->prepare("SELECT id, numero_questoes, status FROM simulado WHERE id = ? AND id_estudante = ?");
    $stmt->bind_param('ii', $id_simulado, $id_estudante);
    $stmt->execute();
    $sim = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$sim) { http_response_code(404); echo json_encode(['sucesso'=>false]); exit; }

    // Já concluído? Devolve o resultado salvo
    if ($sim['status'] === 'concluido') {
        $stmt = $mysqli->prepare("SELECT pontuacao FROM simulado WHERE id = ?");
        $stmt->bind_param('i', $id_simulado);
        $stmt->execute();
        $p = (int)$stmt->get_result()->fetch_assoc()['pontuacao'];
        $stmt->close();

        echo json_encode([
            'sucesso' => true, 'ja_finalizado' => true,
            'acertos' => $p, 'total' => (int)$sim['numero_questoes'],
            'percentual' => $sim['numero_questoes'] > 0 ? round(($p / $sim['numero_questoes']) * 100, 1) : 0,
        ]);
        exit;
    }

    // Conta acertos a partir do histórico
    $stmt = $mysqli->prepare(
        "SELECT COUNT(*) AS acertos FROM estudante_questao
         WHERE id_estudante = ? AND id_simulado = ? AND acerto = 1"
    );
    $stmt->bind_param('ii', $id_estudante, $id_simulado);
    $stmt->execute();
    $acertos = (int)$stmt->get_result()->fetch_assoc()['acertos'];
    $stmt->close();

    $stmt = $mysqli->prepare("SELECT COUNT(*) AS total FROM simulado_questao WHERE id_simulado = ?");
    $stmt->bind_param('i', $id_simulado);
    $stmt->execute();
    $total = (int)$stmt->get_result()->fetch_assoc()['total'];
    $stmt->close();

    $up = $mysqli->prepare("UPDATE simulado SET status='concluido', data_fim=NOW(), pontuacao=? WHERE id = ?");
    $up->bind_param('ii', $acertos, $id_simulado);
    $up->execute();
    $up->close();

    echo json_encode([
        'sucesso'    => true,
        'acertos'    => $acertos,
        'total'      => $total,
        'percentual' => $total > 0 ? round(($acertos / $total) * 100, 1) : 0,
    ]);
} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => 'Erro ao finalizar simulado.']);
}