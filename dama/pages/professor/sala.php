<?php
$titulo = '3º Ano A · Matemática';
$shell = 'professor';
$ativo = 'salas';
ob_start(); ?>
  <script src="<?= url('assets/js/charts.js') ?>" defer></script>
<?php $extra_head = ob_get_clean();
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <nav class="crumbs" aria-label="Você está em"><a href="salas.php">Salas de aula</a><span data-slot="sala.nome"></span></nav>
    <header class="page-head">
      <div>
        <h1 data-slot="sala.nome"></h1>
        <p><span class="code-pill" id="codigo" data-slot="sala.codigo"></span> <button class="btn btn--quiet btn--sm" type="button" data-copy="#codigo">Copiar código</button> · <span data-slot="sala.alunos_count"></span> de 100 alunos</p>
      </div>
      <div class="page-head__actions"><button class="btn btn--primary" type="button" data-dialog-open="nova-ativ">Adicionar questão</button></div>
    </header>

    <div class="tabs" role="tablist" data-tabs aria-label="Seções da sala">
      <button role="tab" id="s-t1" aria-controls="s-p1" aria-selected="true">Exercícios</button>
      <button role="tab" id="s-t2" aria-controls="s-p2" aria-selected="false">Alunos</button>
      <button role="tab" id="s-t3" aria-controls="s-p3" aria-selected="false">Rascunhos</button>
      <button role="tab" id="s-t4" aria-controls="s-p4" aria-selected="false">Desempenho</button>
    </div>

    <!-- Exercícios por categoria -->
    <section id="s-p1" role="tabpanel" aria-labelledby="s-t1" class="grid">
      <div class="grid" style="display: contents" data-list="prof.categorias"></div>
      <button class="btn" type="button" data-dialog-open="nova-cat" style="justify-self: start">Nova categoria</button>
    </section>

    <!-- Alunos -->
    <section id="s-p2" role="tabpanel" aria-labelledby="s-t2" hidden>
      <div class="panel panel--flush">
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Aluno</th><th>Acertos</th><th>Atividades</th><th>Último acesso</th><th></th></tr></thead>
            <tbody data-list="prof.alunos"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Relatório de rascunhos -->
    <section id="s-p3" role="tabpanel" aria-labelledby="s-t3" hidden>
      <div class="split">
        <article class="panel">
          <header class="panel__head"><h3 data-slot="prof.rascunho_titulo"></h3><span class="tag tag--ok" data-slot="prof.rascunho_status"></span></header>
          <div class="grid cols-2" data-list="prof.rascunho_itens"></div>
        </article>
        <aside class="panel">
          <h3>Alunos</h3>
          <ul class="rows" style="margin-top: var(--s3)" data-list="prof.rascunho_alunos"></ul>
        </aside>
      </div>
    </section>

    <!-- Desempenho -->
    <section id="s-p4" role="tabpanel" aria-labelledby="s-t4" hidden>
      <div class="split split--even">
        <article class="panel">
          <header class="panel__head"><h3>Média da turma por semana</h3><span class="small muted">% de acertos</span></header>
          <div data-chart="line" data-labels="" data-values=""></div>
        </article>
        <article class="panel">
          <header class="panel__head"><h3>Por categoria</h3></header>
          <div data-list="prof.desempenho_categorias"></div>
        </article>
      </div>
      <article class="panel" style="margin-top: var(--s4)">
        <header class="panel__head"><h3>Desempenho por aluno</h3></header>
        <div data-list="prof.desempenho_alunos"></div>
      </article>
    </section>
  </main>

  <template data-template="prof.categorias">
    <article class="panel">
      <header class="panel__head"><h3>{{nome}}</h3><button class="btn btn--sm" type="button" data-dialog-open="nova-ativ">Adicionar questão</button></header>
      <ul class="rows" data-list="prof.atividades"></ul>
    </article>
  </template>
  <template data-template="prof.atividades">
    <li><span class="tag {{formato_class}}">{{formato}}</span><div><h4>{{titulo}}</h4><p>{{descricao}}</p></div><a class="link small" href="{{link}}">{{link_texto}}</a></li>
  </template>
  <template data-template="prof.alunos">
    <tr><td>{{nome}}</td><td>{{acertos}}%</td><td>{{atividades}}</td><td>{{ultimo_acesso}}</td><td class="right"><button class="btn btn--danger btn--sm" type="button" data-act="remover-aluno" data-id="{{id}}">Remover</button></td></tr>
  </template>
  <template data-template="prof.rascunho_desenho">
    <figure style="margin: 0"><img class="scribble" src="{{img}}" alt="Rascunho desenhado pelo aluno"><figcaption class="small muted" style="margin-top: 6px">{{legenda}}</figcaption></figure>
  </template>
  <template data-template="prof.rascunho_tex">
    <figure style="margin: 0"><div class="scribble" style="padding: 16px; font: 13px/1.7 var(--f-code); overflow: auto; white-space: pre-wrap">{{tex}}</div><figcaption class="small muted" style="margin-top: 6px">{{legenda}}</figcaption></figure>
  </template>
  <template data-template="prof.rascunho_alunos">
    <li><span class="avatar">{{iniciais}}</span><span><strong>{{nome}}</strong><br><span class="small muted">{{rascunhos}}</span></span><span class="tag {{status_class}}">{{status}}</span></li>
  </template>
  <template data-template="prof.desempenho_categorias">
    <div class="bar-row"><span>{{nome}}</span><div class="meter"><i style="width: {{pct}}%"></i></div><b>{{pct}}%</b></div>
  </template>
  <template data-template="prof.desempenho_alunos">
    <div class="bar-row"><span>{{nome}}</span><div class="meter"><i style="width: {{pct}}%"></i></div><b>{{pct}}%</b></div>
  </template>
  <template data-template="prof.opcoes">
    <option value="{{id}}">{{nome}}</option>
  </template>

  <dialog id="nova-ativ" aria-labelledby="na-t">
    <form class="form" data-form="adicionar-questao-sala">
      <h3 id="na-t">Adicionar questão à sala</h3>
      <div class="field"><label for="na-cat">Categoria</label><select class="select" id="na-cat" name="categoria" data-list="prof.opcoes_categorias"></select></div>
      <div class="field"><span class="label-text">Origem</span>
        <div class="chips"><label class="chip"><input type="radio" name="origem" value="nova" checked><span>Escrever agora</span></label><label class="chip"><input type="radio" name="origem" value="meu-banco"><span>Do meu banco</span></label><label class="chip"><input type="radio" name="origem" value="banco-mathema"><span>Banco da Mathema</span></label></div></div>
      <div class="field"><span class="label-text">Formato</span>
        <div class="chips"><label class="chip"><input type="radio" name="fmt" value="fechada" checked><span>Fechada</span></label><label class="chip"><input type="radio" name="fmt" value="aberta"><span>Aberta</span></label></div></div>
      <div class="field"><label for="na-enun">Enunciado</label><textarea class="textarea" id="na-enun" name="enunciado" required></textarea></div>
      <footer class="dialog__actions"><button class="btn btn--quiet" type="button" data-dialog-close>Cancelar</button><button class="btn btn--primary" type="submit">Adicionar</button></footer>
    </form>
  </dialog>

  <dialog id="nova-cat" aria-labelledby="nc-t">
    <form class="form" data-form="criar-categoria">
      <h3 id="nc-t">Nova categoria</h3>
      <div class="field"><label for="nc-nome">Nome da categoria</label><input class="input" id="nc-nome" name="nome" required placeholder="Ex.: Trigonometria"></div>
      <footer class="dialog__actions"><button class="btn btn--quiet" type="button" data-dialog-close>Cancelar</button><button class="btn btn--primary" type="submit">Criar categoria</button></footer>
    </form>
  </dialog>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
