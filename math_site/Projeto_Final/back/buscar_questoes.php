<?php

require_once ('config.php');

function buscar_questoes(): void {
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['erro' => 'Método não permitido.']);
        exit;
    }
    
    $conteudoId = filter_input(INPUT_POST, 'conteudo_id', FILTER_VALIDATE_INT);

    if (!$conteudoId) {
        http_response_code(400);
        echo json_encode(['erro' => 'ID de conteúdo inválido.']);
        exit;
    }

    try {
        $mysqli = conecta_banco();

        $sql = "
    SELECT q.id, q.enunciado,
           a.id AS alternativa_id, a.letra, a.texto
    FROM questao q
    LEFT JOIN alternativa a ON a.questao_id = q.id
    WHERE q.id_conteudo = ?
    ORDER BY q.id, a.letra
";

$stmt = $mysqli->prepare($sql);
$stmt->bind_param('i', $conteudoId);
$stmt->execute();
$resultado = $stmt->get_result();

$questoes = [];

while ($linha = $resultado->fetch_assoc()) {
    $id = $linha['id'];

    // A consulta traz uma linha por alternativa. Crie a questão uma única vez.
    if (!isset($questoes[$id])) {
        $questoes[$id] = [
            'id' => $id,
            'enunciado' => $linha['enunciado'],
            'alternativas' => [],
        ];
    }

    if ($linha['alternativa_id'] !== null) {
        $questoes[$id]['alternativas'][] = [
            'id' => $linha['alternativa_id'],
            'letra' => $linha['letra'],
            'texto' => $linha['texto'],
        ];
    }
}

echo json_encode(array_values($questoes));
    } catch (Throwable $e) {
        error_log($e->getMessage());
        http_response_code(500);
        echo json_encode(['erro' => 'Erro interno ao buscar questões.']);
    }
}

buscar_questoes();
?>