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

$id_questao     = filter_input(INPUT_POST, 'id_questao',     FILTER_VALIDATE_INT);
$id_alternativa = filter_input(INPUT_POST, 'id_alternativa', FILTER_VALIDATE_INT);

if (!$id_questao || !$id_alternativa) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'erro' => 'Parâmetros inválidos.']);
    exit;
}

// Simulado opcional (se veio, precisa ser válido)
$id_simulado = null;
$raw = $_POST['id_simulado'] ?? '';
if ($raw !== '' && $raw !== null) {
    $val = filter_var($raw, FILTER_VALIDATE_INT);
    if ($val === false || $val < 1) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Simulado inválido.']);
        exit;
    }
    $id_simulado = $val;
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

    // ---------- Se for simulado, valida dono + tempo ----------
    if ($id_simulado !== null) {
        $stmt = $mysqli->prepare("
            SELECT status,
                   CASE
                     WHEN data_inicio IS NULL THEN tempo_limite * 60
                     ELSE GREATEST(0, TIMESTAMPDIFF(SECOND, NOW(),
                                DATE_ADD(data_inicio, INTERVAL tempo_limite MINUTE)))
                   END AS restantes
            FROM simulado
            WHERE id = ? AND id_estudante = ?
        ");
        $stmt->bind_param('ii', $id_simulado, $id_estudante);
        $stmt->execute();
        $sim = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$sim) {
            http_response_code(404);
            echo json_encode(['sucesso' => false, 'erro' => 'Simulado não encontrado.']);
            exit;
        }
        if (in_array($sim['status'], ['concluido', 'expirado'], true)) {
            echo json_encode(['sucesso' => false, 'expirado' => true]);
            exit;
        }
        if ((int)$sim['restantes'] <= 0) {
            $up = $mysqli->prepare("UPDATE simulado SET status='expirado', data_fim=NOW() WHERE id = ?");
            $up->bind_param('i', $id_simulado);
            $up->execute();
            $up->close();
            echo json_encode(['sucesso' => false, 'expirado' => true]);
            exit;
        }
    }

    // ---------- Verifica a alternativa + gabarito ----------
    $stmt = $mysqli->prepare("SELECT letra, correta FROM alternativa WHERE id = ? AND questao_id = ?");
    $stmt->bind_param('ii', $id_alternativa, $id_questao);
    $stmt->execute();
    $alt = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$alt) {
        http_response_code(400);
        echo json_encode(['sucesso' => false, 'erro' => 'Alternativa não pertence à questão.']);
        exit;
    }

    $acertou = (int)$alt['correta'] === 1;
    $letra   = $alt['letra'];

    // ---------- Persiste ----------
    if ($id_simulado === null) {
        // Resposta avulsa (banco de questões) — histórico livre
        $stmt = $mysqli->prepare("
            INSERT INTO estudante_questao
                (id_estudante, id_questao, id_simulado, alternativa_id, resposta, acerto, data_realizacao)
            VALUES (?, ?, NULL, ?, ?, ?, NOW())
        ");
        $acertouInt = (int)$acertou;
        $stmt->bind_param('iiisi', $id_estudante, $id_questao, $id_alternativa, $letra, $acertouInt);
    } else {
        // Resposta de simulado — único por (estudante, questão, simulado)
        $stmt = $mysqli->prepare("
            INSERT INTO estudante_questao
                (id_estudante, id_questao, id_simulado, alternativa_id, resposta, acerto, data_realizacao)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                alternativa_id  = VALUES(alternativa_id),
                resposta        = VALUES(resposta),
                acerto          = VALUES(acerto),
                data_realizacao = NOW()
        ");
        $acertouInt = (int)$acertou;
        $stmt->bind_param('iiiisi', $id_estudante, $id_questao, $id_simulado, $id_alternativa, $letra, $acertouInt);
    }
    $stmt->execute();
    $stmt->close();

    // Se errou, devolve qual era a correta (para feedback)
    $correta = null;
    if (!$acertou) {
        $stmt = $mysqli->prepare(
            "SELECT letra, texto FROM alternativa WHERE questao_id = ? AND correta = 1 LIMIT 1"
        );
        $stmt->bind_param('i', $id_questao);
        $stmt->execute();
        $correta = $stmt->get_result()->fetch_assoc();
        $stmt->close();
    }

    echo json_encode([
        'sucesso'          => true,
        'acertou'          => $acertou,
        'letra_escolhida'  => $letra,
        'resposta_correta' => $correta, // null quando acertou
    ]);
} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['sucesso' => false, 'erro' => 'Erro ao salvar resposta.']);
}