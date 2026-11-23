<?php
/* Variáveis esperadas (definidas na página antes do include):
   $titulo (string) · $shell ('public'|'aluno'|'professor'|'none') · $ativo (item do menu)
   $extra_head (HTML opcional: css/js extras) · $body_attrs (atributos extras do <body>) */
require_once __DIR__ . '/config.php';
$shell = $shell ?? 'public';
$ativo = $ativo ?? '';
$extra_head = $extra_head ?? '';
$body_attrs = $body_attrs ?? '';
?><!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($titulo ?? 'Mathema') ?> · Mathema</title>
  <link rel="icon" href="<?= url('assets/img/favicon.svg') ?>" type="image/svg+xml">
  <link rel="stylesheet" href="<?= url('assets/css/main.css') ?>">
<?= $extra_head ?>
  <script src="<?= url('assets/js/ui.js') ?>" defer></script>
</head>
<body data-shell="<?= e($shell) ?>" data-active="<?= e($ativo) ?>" <?= $body_attrs ?>>
<?php if ($shell !== 'none') include __DIR__ . '/cabecalho.php'; ?>
