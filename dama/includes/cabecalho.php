<?php
/* Cabeçalho do site. Itens do menu por perfil: [arquivo, rótulo, chave]. */
$menus = [
  'public'    => [['index.php#o-que-e','O que é',''],['index.php#recursos','Recursos',''],['index.php#como-funciona','Como funciona',''],['index.php#professores','Para professores','']],
  'aluno'     => [['pages/aluno/dashboard.php','Início','dashboard'],['pages/aluno/trilha.php','Trilha','trilha'],['pages/aluno/salas.php','Salas','salas'],['pages/aluno/simulado.php','Simulados','simulados'],['pages/aluno/competicoes.php','Competições','competicoes'],['pages/aluno/perfil.php','Perfil','perfil']],
  'professor' => [['pages/professor/salas.php','Salas de aula','salas'],['pages/professor/banco.php','Banco de questões','banco'],['pages/professor/minhas-questoes.php','Minhas questões','minhas']],
];
$home = ['public' => 'index.php', 'aluno' => 'pages/aluno/dashboard.php', 'professor' => 'pages/professor/salas.php'][$shell];
?>
<header class="site-header">
  <div class="container site-header__in">
    <a class="brand" href="<?= url($home) ?>">
      <svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#ff5a1f"/><path d="M7 17l5 5 6-13h8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Mathema</span>
    </a>
    <nav class="nav" id="main-nav" aria-label="Principal">
<?php foreach ($menus[$shell] as [$href, $rotulo, $chave]): ?>
      <a href="<?= url($href) ?>"<?= ($chave && $chave === $ativo) ? ' aria-current="page"' : '' ?>><?= e($rotulo) ?></a>
<?php endforeach; ?>
    </nav>
    <div class="header-actions">
<?php if ($shell === 'public'): ?>
      <a class="btn btn--quiet btn--sm" href="<?= url('pages/auth/login-aluno.php') ?>">Entrar</a>
      <a class="btn btn--primary btn--sm" href="<?= url('pages/auth/cadastro-aluno.php') ?>">Inscrever-se</a>
<?php elseif ($shell === 'aluno'): ?>
      <span class="score-chip hide-sm" title="Sua pontuação"><span data-slot="user.pontuacao"></span> pts</span>
      <a class="avatar" href="<?= url('pages/aluno/perfil.php') ?>" aria-label="Seu perfil" data-slot="user.iniciais"></a>
      <button class="btn btn--quiet btn--sm hide-sm" type="button" data-act="sair">Sair</button>
<?php else: ?>
      <span class="small muted hide-sm" data-slot="user.nome"></span>
      <span class="avatar" data-slot="user.iniciais"></span>
      <button class="btn btn--quiet btn--sm hide-sm" type="button" data-act="sair">Sair</button>
<?php endif; ?>
      <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="main-nav">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 5h14M2 9h14M2 13h14"/></svg>
      </button>
    </div>
  </div>
</header>
