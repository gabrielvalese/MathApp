<?php
$titulo = 'Perfil';
$shell = 'aluno';
$ativo = 'perfil';
ob_start(); ?>
  <script src="<?= url('assets/js/charts.js') ?>" defer></script>
<?php $extra_head = ob_get_clean();
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div class="row" style="gap: var(--s4)">
        <span class="avatar avatar--lg" aria-hidden="true" data-slot="user.iniciais"></span>
        <div><h1 data-slot="user.nome"></h1><p data-slot="user.serie_escola"></p></div>
      </div>
    </header>

    <section class="stats">
      <article class="stat"><span class="label">Questões feitas</span><div class="stat__v" data-slot="perfil.questoes"></div></article>
      <article class="stat"><span class="label">Certas de primeira</span><div class="stat__v" data-slot="perfil.certas_primeira"></div><p class="stat__note" data-slot="perfil.certas_primeira_nota"></p></article>
      <article class="stat"><span class="label">Pontuação</span><div class="stat__v" data-slot="perfil.pontuacao"></div></article>
      <article class="stat"><span class="label">Sequência</span><div class="stat__v"><span data-slot="perfil.sequencia"></span><small> dias</small></div></article>
    </section>

    <section class="panel" style="margin-top: var(--s4)">
      <header class="panel__head"><h3>Dias em que você mais estudou</h3><span class="small muted">Últimos 12 meses</span></header>
      <!-- data-days = JSON {"AAAA-MM-DD": questões}; depois Mathema.charts.render(elemento) -->
      <div class="heat-wrap"><div data-chart="heatmap" data-days=""></div></div>
      <div class="heat-legend">Menos <i></i><i style="background:#ffd9c7"></i><i style="background:#ffb08a"></i><i style="background:#ff8451"></i><i style="background:#ff5a1f"></i> Mais</div>
    </section>

    <div class="split split--even" style="margin-top: var(--s4)">
      <section class="panel">
        <header class="panel__head"><h3>Desempenho por prova</h3><span class="small muted">Acertos em cada concurso ou olimpíada</span></header>
        <div class="grid cols-2" style="row-gap: var(--s5)" data-list="perfil.provas"></div>
      </section>
      <section class="panel">
        <header class="panel__head"><h3>Desempenho por tema</h3><span class="small muted">Questões da trilha e dos simulados</span></header>
        <div data-chart="radar" data-labels="" data-values=""></div>
      </section>
    </div>
  </main>

  <template data-template="perfil.provas">
    <div data-chart="donut" data-value="{{pct}}" data-label="{{prova}}" data-sub="{{sub}}"></div>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
