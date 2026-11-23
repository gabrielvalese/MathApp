<?php
$titulo = 'Questões finais de Álgebra';
$shell = 'aluno';
$ativo = 'trilha';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <nav class="crumbs" aria-label="Você está em"><a href="trilha.php">Trilha</a><span data-slot="final.unidade"></span><span>Questões finais</span></nav>
    <header class="page-head">
      <div>
        <h1>Questões finais de <span data-slot="final.unidade"></span></h1>
        <p>Questões de concursos e olimpíadas. Mostramos só os conteúdos que você já estudou, para você aplicar o que sabe em vez de decorar um método.</p>
      </div>
    </header>

    <section class="panel" style="margin-bottom: var(--s4)">
      <header class="panel__head"><h3>Conteúdos considerados</h3><span class="small muted">Libera mais questões a cada ramificação concluída</span></header>
      <div class="tags" data-list="final.conteudos"></div>
    </section>

    <div class="chips" data-filter-group="#questoes" role="radiogroup" aria-label="Filtrar por prova" style="margin-bottom: var(--s4)">
      <label class="chip"><input type="radio" name="prova" data-filter="all" checked><span>Todas</span></label>
      <label class="chip"><input type="radio" name="prova" data-filter="enem"><span>ENEM</span></label>
      <label class="chip"><input type="radio" name="prova" data-filter="obmep"><span>OBMEP</span></label>
      <label class="chip"><input type="radio" name="prova" data-filter="fuvest"><span>Vestibulares</span></label>
      <label class="chip"><input type="radio" name="prova" data-filter="concurso"><span>Concursos</span></label>
    </div>

    <section class="panel">
      <ul class="rows" id="questoes" data-list="final.questoes"></ul>
    </section>
  </main>

  <template data-template="final.conteudos">
    <span class="tag {{classe}}">{{texto}}</span>
  </template>
  <template data-template="final.questoes">
    <li data-tags="{{filtro}}"><span class="tag tag--orange">{{prova}}</span><div><h4>{{titulo}}</h4><p>{{temas}}</p></div><a class="btn btn--sm" href="questao.php?id={{id}}">Resolver</a></li>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
