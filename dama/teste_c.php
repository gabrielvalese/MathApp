<?php

require_once __DIR__ . '/includes/config.php';

echo 'Conexão com MariaDB realizada com sucesso!';

$resultado = $mysqli->query('SHOW TABLES');

while ($linha = $resultado->fetch_row()) {
    echo '<br>' . htmlspecialchars($linha[0]);
}

/* apaga depois q é crítico esse aruqivo, mas serve de teste */