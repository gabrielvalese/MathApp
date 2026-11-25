    <?php

require_once ('config.php');

function buscar_conteudos(): void
{
    header('Content-Type: application/json; charset=utf-8');

    try {
        $mysqli = conecta_banco();

        $sql = "
            SELECT 
                c.id,
                c.descricao,
                c.dificuldade,
                c.nome
            FROM Conteudo c
            ORDER BY c.id ASC
        ";

        $result = $mysqli->query($sql);
        $conteudos = $result->fetch_all(MYSQLI_ASSOC);

        echo json_encode($conteudos);
    } catch (Throwable $e) {
        error_log($e->getMessage());
        http_response_code(500);
        echo json_encode(['erro' => 'Erro interno ao buscar conteúdos.']);
    }
}

buscar_conteudos();