<?php
$titulo = 'Banco de questões';
$shell = 'professor';
$ativo = 'banco';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div>
        <h1>Banco de questões</h1>
        <p>Questões da Mathema, organizadas por tema. Adicione qualquer uma a uma das suas salas.</p>
      </div>
    </header>

    <div class="stack" style="margin-bottom: var(--s5)">
      <div class="chips" data-filter-group="#banco" role="radiogroup" aria-label="Filtrar por tema">
        <label class="chip"><input type="radio" name="tema" data-filter="all" checked><span>Todos os temas</span></label>
        <label class="chip"><input type="radio" name="tema" data-filter="funcoes"><span>Funções</span></label>
        <label class="chip"><input type="radio" name="tema" data-filter="geometria"><span>Geometria</span></label>
        <label class="chip"><input type="radio" name="tema" data-filter="equacoes"><span>Equações</span></label>
        <label class="chip"><input type="radio" name="tema" data-filter="probabilidade"><span>Probabilidade</span></label>
      </div>
    </div>

    <section class="panel">
      <ul class="rows" id="banco" data-list="banco.questoes"></ul>
    </section>
  </main>

  <template data-template="banco.questoes">
    <li data-tags="{{filtro}}"><span class="tag tag--orange">{{prova}}</span><div><h4>{{titulo}}</h4><p>{{temas}} · {{formato}}</p></div><button class="btn btn--sm" type="button" data-dialog-open="add-sala" data-act="selecionar-questao" data-id="{{id}}">Adicionar à sala</button></li>
  </template>
  <template data-template="prof.opcoes">
    <option value="{{id}}">{{nome}}</option>
  </template>

  <dialog id="add-sala" aria-labelledby="as-t">
    <form class="form" data-form="adicionar-banco-sala">
      <h3 id="as-t">Adicionar à sala</h3>
      <div class="field"><label for="as-sala">Sala</label><select class="select" id="as-sala" name="sala" data-list="prof.opcoes_salas"></select></div>
      <div class="field"><label for="as-cat">Categoria</label><select class="select" id="as-cat" name="categoria" data-list="prof.opcoes_categorias"></select></div>
      <footer class="dialog__actions"><button class="btn btn--quiet" type="button" data-dialog-close>Cancelar</button><button class="btn btn--primary" type="submit">Adicionar</button></footer>
    </form>
  </dialog>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
