<?php
$titulo = 'Competições';
$shell = 'aluno';
$ativo = 'competicoes';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div>
        <h1>Competições</h1>
        <p>Provas criadas por professores, com tempo limite. Ao acabar o tempo, enviamos o que você já tinha feito.</p>
      </div>
    </header>

    <div class="split split--wide">
      <section>
        <div class="tabs" role="tablist" data-tabs aria-label="Situação">
          <button role="tab" id="c-t1" aria-controls="c-p1" aria-selected="true">Abertas</button>
          <button role="tab" id="c-t2" aria-controls="c-p2" aria-selected="false">Encerradas</button>
        </div>
        <div id="c-p1" role="tabpanel" aria-labelledby="c-t1" class="grid" data-list="competicoes.abertas"></div>
        <div id="c-p2" role="tabpanel" aria-labelledby="c-t2" class="grid" data-list="competicoes.encerradas" hidden></div>
      </section>

      <aside class="panel" id="ranking">
        <header class="panel__head"><h3>Ranking geral</h3><span class="small muted">Esta semana</span></header>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>#</th><th>Aluno</th><th class="right">Pontos</th></tr></thead>
            <tbody data-list="ranking.geral"></tbody>
          </table>
        </div>
      </aside>
    </div>
  </main>

  <!-- Competição aberta (use competicoes.abertas_inscricao para as que ainda não começaram) -->
  <template data-template="competicoes.abertas">
    <article class="panel">
      <div class="row row--between"><h3>{{titulo}}</h3><span class="tag {{status_class}}">{{status}}</span></div>
      <p class="small muted" style="margin: 6px 0 12px">{{professor}} · {{escola}}</p>
      <div class="tags" data-list="competicoes.tags"></div>
      <div class="row row--between" style="margin-top: var(--s4)"><span class="small muted">{{prazo}}</span><a class="btn btn--primary btn--sm" href="competicao.php?id={{id}}">Participar</a></div>
    </article>
  </template>
  <template data-template="competicoes.abertas_inscricao">
    <article class="panel">
      <div class="row row--between"><h3>{{titulo}}</h3><span class="tag {{status_class}}">{{status}}</span></div>
      <p class="small muted" style="margin: 6px 0 12px">{{professor}} · {{escola}}</p>
      <div class="tags" data-list="competicoes.tags"></div>
      <div class="row row--between" style="margin-top: var(--s4)"><span class="small muted">{{prazo}}</span><button class="btn btn--sm" type="button" data-act="inscrever-competicao" data-id="{{id}}">Inscrever-se</button></div>
    </article>
  </template>
  <template data-template="competicoes.encerradas">
    <article class="panel">
      <div class="row row--between"><h3>{{titulo}}</h3><span class="tag">Encerrada</span></div>
      <p class="small muted" style="margin: 6px 0 12px">{{professor}} · {{colocacao}}</p>
      <div class="row row--between"><span class="small muted">{{nota}}</span><a class="btn btn--sm" href="simulado-resultado.php?competicao={{id}}">Ver resultado</a></div>
    </article>
  </template>
  <template data-template="competicoes.tags">
    <span class="tag">{{texto}}</span>
  </template>
  <template data-template="ranking.geral">
    <tr class="{{classe}}"><td>{{posicao}}</td><td>{{nome}}</td><td class="right">{{pontos}}</td></tr>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
