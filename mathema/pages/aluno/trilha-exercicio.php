<?php
$titulo = 'Exercício';
$shell = 'none';
$ativo = '';
ob_start(); ?>
  <script src="<?= url('assets/js/quiz.js') ?>" defer></script>
<?php $extra_head = ob_get_clean();
require __DIR__ . '/../../includes/topo.php';
?>
  <div class="lesson" id="lesson">
    <header class="lesson__top">
      <a class="lesson__close" href="trilha.php" aria-label="Sair do exercício">×</a>
      <div class="ticks" data-ticks role="progressbar" aria-label="Progresso da ramificação"></div>
      <span class="lesson__xp" data-xp>+0 XP</span>
    </header>

    <main class="lesson__body" data-body><p class="muted">Carregando exercícios…</p></main>

    <footer class="lesson__bar" data-bar>
      <div class="lesson__bar-in">
        <div class="fb" data-fb aria-live="polite"></div>
        <button class="btn btn--primary" type="button" data-action disabled>Verificar</button>
      </div>
    </footer>
  </div>
  <noscript><p style="padding: 24px">Ative o JavaScript para resolver os exercícios.</p></noscript>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
