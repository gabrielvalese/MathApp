<?php
require_once('config.php');
session_start();
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false]);
    exit;
}
if (!isset($_SESSION['usuario']) || $_SESSION['tipo_conta'] !== 'estudante') {
    http_response_code(401);
    echo json_encode(['sucesso' => false]);
    exit;
}

$id_simulado = filter_input(INPUT_POST, 'id_simulado', FILTER_VALIDATE_INT);
if (!$id_simulado) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'erro' => 'ID inválido.']);
    exit;
}

try {
    $mysqli = conecta_banco();

    $stmt = $mysqli->prepare("SELECT id FROM Estudante WHERE email = ?");
    $stmt->bind_param('s', $_SESSION['usuario']);
    $stmt->execute();
    $estudante = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    if (!$estudante) { http_response_code(401); echo json_encode(['sucesso' => false]); exit; }
    $id_estudante = (int)$estudante['id'];

    // Carrega simulado + segundos restantes calculados no próprio MySQL (evita fuso do PHP)
    $stmt = $mysqli->prepare("
        SELECT id, tempo_limite, numero_questoes, status, pontuacao,
               data_inicio, data_fim,
               CASE
                 WHEN data_inicio IS NULL THEN tempo_limite * 60
                 ELSE GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(),
                            DATE_ADD(data_inicio, INTERVAL tempo_limite MINUTE)))
               END AS segundos_restantes
        FROM simulado
        WHERE id = ? AND id_estudante = ?
    ");
    $stmt->bind_param('ii', $id_simulado, $id_estudante);
    $stmt->execute();
    $simulado = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$simulado) {
        http_response_code(404);
        echo json_encode(['sucesso' => false, 'erro' => 'Simulado não encontrado.']);
        exit;
    }

    // Primeira abertura → inicia contagem
    if ($simulado['status'] === 'criado') {
        $up = $mysqli->prepare("UPDATE simulado SET status='em_andamento', data_inicio=NOW() WHERE id = ?");
        $up->bind_param('i', $id_simulado);
        $up->execute();
        $up->close();
        $simulado['status']             = 'em_andamento';
        $simulado['segundos_restantes'] = (int)$simulado['tempo_limite'] * 60;
    }

    // Se o tempo já acabou
    if ($simulado['status'] === 'em_andamento' && (int)$simulado['segundos_restantes'] <= 0) {
        $up = $mysqli->prepare("UPDATE simulado SET status='expirado', data_fim=NOW() WHERE id = ?");
        $up->bind_param('i', $id_simulado);
        $up->execute();
        $up->close();
        $simulado['status'] = 'expirado';
    }


    $sqlQ = "
        SELECT q.id AS questao_id, q.enunciado, sq.ordem,
               a.id AS alternativa_id, a.letra, a.texto,
               eq.alternativa_id AS resposta_escolhida,
               eq.acerto
        FROM simulado_questao sq
        INNER JOIN questao q     ON q.id = sq.id_questao
        LEFT  JOIN alternativa a ON a.questao_id = q.id
        LEFT  JOIN estudante_questao eq
               ON eq.id_questao = q.id
              AND eq.id_simulado = sq.id_simulado
              AND eq.id_estudante = ?
        WHERE sq.id_simulado = ?
        ORDER BY sq.ordem, a.letra
    ";
    $stmt = $mysqli->prepare($sqlQ);
    $stmt->bind_param('ii', $id_estudante, $id_simulado);
    $stmt->execute();
    $res = $stmt->get_result();

    $questoes = [];
    while ($row = $res->fetch_assoc()) {
        $qid = (int)$row['questao_id'];
        if (!isset($questoes[$qid])) {
            $questoes[$qid] = [
                'id'                => $qid,
                'enunciado'         => $row['enunciado'],
                'resposta_escolhida'=> $row['resposta_escolhida'] !== null ? (int)$row['resposta_escolhida'] : null,
                'acerto'            => $row['acerto'] !== null ? (bool)$row['acerto'] : null,
                'alternativas'      => [],
            ];
        }
        if ($row['alternativa_id'] !== null) {
            $questoes[$qid]['alternativas'][] = [
                'id'    => (int)$row['alternativa_id'],
                'letra' => $row['letra'],
                'texto' => $row['texto'],
            ];
        }
    }
    $stmt->close();

    echo json_encode([
        'sucesso'            => true,
        'id'                 => (int)$simulado['id'],
        'status'             => $simulado['status'],
        'tempo_limite'       => (int)$simulado['tempo_limite'],
        'segundos_restantes' => (int)$simulado['segundos_restantes'],
        'numero_questoes'    => (int)$simulado['numero_questoes'],
        'pontuacao'          => (int)$simulado['pontuacao'],
        'questoes'           => array_values($questoes),
    ]);
} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => 'Erro ao buscar simulado.']);
}