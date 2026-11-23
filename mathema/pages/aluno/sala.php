<?php
$titulo = '3º Ano A · Matemática';
$shell = 'aluno';
$ativo = 'salas';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <nav class="crumbs" aria-label="Você está em"><a href="salas.php">Salas</a><span data-slot="sala.nome"></span></nav>
    <header class="page-head">
      <div>
        <h1 data-slot="sala.nome"></h1>
        <p><span data-slot="sala.professor"></span> · <span data-slot="sala.alunos"></span> alunos. As atividades desta sala só aparecem para quem está nela.</p>
      </div>
      <div class="page-head__actions"><span class="code-pill" title="Código da sala" data-slot="sala.codigo"></span></div>
    </header>

    <div class="split">
      <div class="grid" data-list="sala.categorias"></div>
      <aside class="panel">
        <h3>Seu andamento na sala</h3>
        <div class="stack" style="margin-top: var(--s4)">
          <div><div class="row row--between small" style="margin-bottom: 6px"><span>Atividades</span><b data-slot="sala.andamento_atividades"></b></div><div class="meter"><i style="width: 0%" data-slot-width="sala.andamento_atividades_pct"></i></div></div>
          <div><div class="row row--between small" style="margin-bottom: 6px"><span>Acertos</span><b data-slot="sala.andamento_acertos"></b></div><div class="meter"><i style="width: 0%" data-slot-width="sala.andamento_acertos_pct"></i></div></div>
        </div>
      </aside>
    </div>
  </main>

  <template data-template="sala.categorias">
    <section class="panel">
      <header class="panel__head"><h3>{{nome}}</h3><span class="small muted">{{concluidas}} de {{total}} concluídas</span></header>
      <ul class="rows" data-list="sala.atividades"></ul>
    </section>
  </template>
  <template data-template="sala.atividades">
    <li><span class="tag {{status_class}}">{{status}}</span><div><h4>{{titulo}}</h4><p>{{descricao}}</p></div><a class="btn btn--sm {{acao_class}}" href="questao.php?atividade={{id}}">{{acao}}</a></li>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
