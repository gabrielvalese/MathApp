<?php
require_once("config.php");

function validaUsuario($email, $senha, $perfil) {
    $mysqli = conecta_banco();
    if($perfil === 'estudante') {
        try { 
            $consulta = $mysqli->prepare("SELECT * FROM Estudante WHERE email = ?");
            $consulta->bind_param("s", $email);
            $consulta->execute();
            $resultado = $consulta->get_result();
            if($resultado->num_rows ===1) {
                $usuario = $resultado->fetch_assoc();
                $hash_banco = $usuario['senha'];

                if(password_verify($senha, $hash_banco)){
                    $consulta->close();
                    session_start();
                    $_SESSION['usuario'] = $email;
                    $_SESSION['tipo_conta'] = $perfil;
                    return TRUE;
                } else {
                    $consulta->close();
                    return FALSE;
                }
            } else {
                $consulta->close();
                return FALSE;
            }
        } catch(Exception $erro) {
            error_log($erro->getMessage());
            exit('Algo deu errado , tente novamente');
        }
    } elseif($perfil === 'professor') {
        try { 
            $consulta = $mysqli->prepare("SELECT * FROM Professor WHERE email = ?");
            $consulta->bind_param("s", $email);
            $consulta->execute();
            $resultado = $consulta->get_result();
            if($resultado->num_rows ===1) {
                $usuario = $resultado->fetch_assoc();
                $hash_banco = $usuario['senha'];

                if(password_verify($senha, $hash_banco)){
                    $consulta->close();
                    session_start();
                    $_SESSION['usuario'] = $email;
                    $_SESSION['tipo_conta'] = $perfil;
                    return TRUE;
                } else {
                    $consulta->close();
                    return FALSE;
                }
            } else {
                $consulta->close();
                return FALSE;
            }
        } catch(Exception $erro) {
            error_log($erro->getMessage());
            exit('Algo deu errado , tente novamente');
        }
    }
    
    
    return false;
    }

function expulsaUsuario() {
    if(isset($_SESSION['usuario'])){
    session_destroy();
    }
    header('Location: /Projeto_Final/front/index.php', true, 303);
    exit;
}


function verificaUsuario() {
if(!isset($_SESSION['usuario'])){
    expulsaUsuario();
    }
}




?>