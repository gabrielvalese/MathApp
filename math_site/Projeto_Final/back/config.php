<?php


ini_set('session.gc_maxlifetime', '2592000');

function conecta_banco() : mysqli  {
    
    static $mysqli = null;

    if($mysqli === null){
    $_DB['server'] = 'localhost'; 
    $_DB['user'] = 'root';
    $_DB['password'] = '';
    $_DB['database'] = 'mathapp'; 
    
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); 
    
    try {
        $mysqli = new mysqli($_DB['server'], $_DB['user'], $_DB['password'], $_DB['database']);
        $mysqli->set_charset("utf8mb4");
    } catch (Exception $e) {
        error_log($e->getMessage());
        exit('Alguma coisa estranha aconteceu...');
    }
}
    return $mysqli;
}
?>