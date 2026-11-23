<?php
$titulo = 'Resultado do simulado';
$shell = 'aluno';
$ativo = 'simulados';
ob_start(); ?>
  <script src="<?= url('assets/js/charts.js') ?>" defer></script>
<?php $extra_head = ob_get_clean();
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div>
        <h1>Você acertou <span data-slot="resultado.acertos"></span> de <span data-slot="resultado.total"></span></h1>
        <p data-slot="resultado.resumo"></p>
      </div>
      <div class="page-head__actions"><a class="btn" href="simulado.php">Novo simulado</a><a class="btn btn--primary" href="trilha.php">Revisar na trilha</a></div>
    </header>

    <section class="stats">
      <article class="stat"><span class="label">Acertos</span><div class="stat__v"><span data-slot="resultado.acertos"></span><small> / <span data-slot="resultado.total"></span></small></div><p class="stat__note" data-slot="resultado.acertos_nota"></p></article>
      <article class="stat"><span class="label">Tempo usado</span><div class="stat__v"><span data-slot="resultado.tempo"></span><small> min</small></div><p class="stat__note" data-slot="resultado.tempo_nota"></p></article>
      <article class="stat"><span class="label">Em branco</span><div class="stat__v" data-slot="resultado.em_branco"></div><p class="stat__note" data-slot="resultado.em_branco_nota"></p></article>
      <article class="stat"><span class="label">Pontos ganhos</span><div class="stat__v" data-slot="resultado.pontos"></div><p class="stat__note">Somados ao seu total</p></article>
    </section>

    <div class="split" style="margin-top: var(--s4)">
      <section class="panel">
        <header class="panel__head"><h3>Desempenho por conteúdo</h3></header>
        <div data-list="resultado.conteudos"></div>
      </section>
      <aside class="panel">
        <header class="panel__head"><h3>Questões</h3></header>
        <div class="qnav" aria-label="Resultado por questão" data-list="resultado.navegacao"></div>
        <p class="small muted" style="margin-top: var(--s3)">Verde: acerto. Vermelho: erro. Sem cor: em branco.</p>
      </aside>
    </div>

    <section class="panel" style="margin-top: var(--s4)">
      <header class="panel__head"><h3>Revisão das questões</h3></header>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Nº</th><th>Conteúdo</th><th>Sua resposta</th><th>Gabarito</th><th>Resultado</th><th></th></tr></thead>
          <tbody data-list="resultado.revisao"></tbody>
        </table>
      </div>
    </section>
  </main>

  <template data-template="resultado.conteudos">
    <div class="bar-row"><span>{{nome}}</span><div class="meter"><i style="width: {{pct}}%"></i></div><b>{{acertos}}/{{total}}</b></div>
  </template>
  <template data-template="resultado.navegacao">
    <a class="{{classe}}" href="#q{{n}}">{{n}}</a>
  </template>
  <template data-template="resultado.revisao">
    <tr id="q{{n}}"><td>{{n}}</td><td>{{conteudo}}</td><td>{{resposta}}</td><td>{{gabarito}}</td><td><span class="tag {{resultado_class}}">{{resultado}}</span></td><td class="right"><a class="link small" href="questao.php?id={{questao_id}}">Rever</a></td></tr>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
