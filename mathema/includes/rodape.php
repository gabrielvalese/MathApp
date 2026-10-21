<?php if (($shell ?? 'public') !== 'none'): ?>
<footer class="site-footer">
  <div class="container site-footer__in">
    <span>Mathema · Matemática para o Ensino Médio, alinhada à BNCC</span>
    <nav aria-label="Rodapé">
      <a href="<?= url('index.php') ?>">Início</a>
      <a href="<?= url('pages/auth/login-aluno.php') ?>">Entrar</a>
      <a href="<?= url('pages/auth/cadastro-professor.php') ?>">Sou professor</a>
    </nav>
  </div>
</footer>
<?php endif; ?>
</body>
</html>
