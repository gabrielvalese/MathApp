<?php
$titulo = 'Início';
$shell = 'aluno';
$ativo = 'dashboard';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <!-- Todas as opções, no topo -->
    

    <header class="page-head" style="margin-top: var(--s8)">
      <div>
        <h1>Olá, <span data-slot="user.nome"></span>. Vamos continuar?</h1>
        <p data-slot="user.sequencia_texto"></p>
      </div>
      <div class="page-head__actions"><a class="btn btn--primary" href="trilha-exercicio.php">Continuar a trilha</a></div>
    </header>

    <!-- Desempenho e pontuação -->
    <section class="stats" aria-label="Seu desempenho">
      <article class="stat"><span class="label">Pontuação</span><div class="stat__v" data-slot="stats.pontuacao"></div><p class="stat__note" data-slot="stats.pontuacao_nota"></p></article>
      <article class="stat"><span class="label">Acertos de primeira</span><div class="stat__v"><span data-slot="stats.acertos_primeira"></span><small>%</small></div><p class="stat__note" data-slot="stats.acertos_primeira_nota"></p></article>
      <article class="stat"><span class="label">Questões resolvidas</span><div class="stat__v" data-slot="stats.questoes"></div><p class="stat__note" data-slot="stats.questoes_nota"></p></article>
      <article class="stat"><span class="label">Posição na semana</span><div class="stat__v" data-slot="stats.posicao"></div><p class="stat__note" data-slot="stats.posicao_nota"></p></article>
    </section>

    <div class="split" style="margin-top: var(--s4)">
      <div class="grid">
        <article class="panel">
          <header class="panel__head"><h3>Onde você parou</h3><a class="link small" href="trilha.php">Ver trilha</a></header>
          <p class="label" data-slot="parou.unidade"></p>
          <h4 style="font-size: 1.3rem; font-family: var(--f-display); margin: 4px 0 12px" data-slot="parou.ramificacao"></h4>
          <div class="ticks" style="max-width: 360px" data-progress="0" data-total="10" data-slot="parou.feitas"></div>
          <p class="small muted" style="margin-top: 8px" data-slot="parou.progresso_texto"></p>
        </article>

        <article class="panel">
          <header class="panel__head"><h3>Desempenho por unidade</h3></header>
          <div data-list="dashboard.unidades"></div>
        </article>
      </div>

      <aside class="grid">
        <article class="panel">
          <header class="panel__head"><h3>Ranking da semana</h3><a class="link small" href="competicoes.php#ranking">Completo</a></header>
          <ol class="rows" data-list="dashboard.ranking"></ol>
        </article>
        <article class="panel panel--tint">
          <h3>Próximo prazo</h3>
          <p style="margin-top: 6px"><strong data-slot="prazo.titulo"></strong><br><span class="small" data-slot="prazo.detalhe"></span></p>
          <a class="btn btn--sm" style="margin-top: 12px" href="sala.php">Abrir sala</a>
        </article>
      </aside>
    </div>

    <nav class="shortcuts" aria-label="Atalhos">
      <a class="shortcut" href="trilha.php"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18h6a4 4 0 0 0 0-8h-2a4 4 0 0 1 0-8h6"/></svg><b>Trilha</b><span>Aprender por unidade</span></a>
      <a class="shortcut" href="salas.php"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18M5 20V9l7-5 7 5v11M10 20v-6h4v6"/></svg><b>Salas</b><span>Atividades do professor</span></a>
      <a class="shortcut" href="simulado.php"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg><b>Simulados</b><span>Monte o seu</span></a>
      <a class="shortcut" href="competicoes.php"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/></svg><b>Competições</b><span>Provas e ranking</span></a>
      <a class="shortcut" href="perfil.php"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg><b>Perfil</b><span>Sua análise</span></a>
    </nav>
    
  </main>

  <!-- Modelos de linha. Campos entre {{ }} são preenchidos por Mathema.renderList(nome, itens). -->
  <template data-template="dashboard.unidades">
    <div class="bar-row"><span>{{nome}}</span><div class="meter"><i style="width: {{pct}}%"></i></div><b>{{pct}}%</b></div>
  </template>
  <template data-template="dashboard.ranking">
    <li class="{{classe}}"><span class="badge-n {{badge}}">{{posicao}}</span><span>{{nome}}</span><b>{{pontos}}</b></li>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
