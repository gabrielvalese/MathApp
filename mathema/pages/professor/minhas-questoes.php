<?php
$titulo = 'Minhas questões';
$shell = 'professor';
$ativo = 'minhas';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div>
        <h1>Minhas questões</h1>
        <p>As questões que você criou. Elas podem ser usadas em qualquer uma das suas salas e em competições.</p>
      </div>
      <div class="page-head__actions"><button class="btn btn--primary" type="button" data-dialog-open="nova-q">Nova questão</button></div>
    </header>

    <section class="panel">
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Questão</th><th>Tema</th><th>Formato</th><th>Usada em</th><th></th></tr></thead>
          <tbody data-list="minhas.questoes"></tbody>
        </table>
      </div>
    </section>
  </main>

  <template data-template="minhas.questoes">
    <tr><td><strong>{{titulo}}</strong></td><td>{{tema}}</td><td><span class="tag {{formato_class}}">{{formato}}</span></td><td>{{uso}}</td><td class="right"><button class="btn btn--quiet btn--sm" type="button" data-act="editar-questao" data-id="{{id}}">Editar</button></td></tr>
  </template>
  <template data-template="prof.opcoes">
    <option value="{{id}}">{{nome}}</option>
  </template>

  <dialog id="nova-q" aria-labelledby="nq-t">
    <form class="form" data-form="criar-questao">
      <h3 id="nq-t">Nova questão</h3>
      <div class="field"><span class="label-text">Formato</span>
        <div class="chips"><label class="chip"><input type="radio" name="fmt" value="fechada" checked><span>Fechada</span></label><label class="chip"><input type="radio" name="fmt" value="aberta"><span>Aberta</span></label></div></div>
      <div class="field"><label for="nq-tema">Tema</label><select class="select" id="nq-tema" name="tema" required data-list="prof.opcoes_temas"><option value="">Selecione</option></select></div>
      <div class="field"><label for="nq-enun">Enunciado</label><textarea class="textarea" id="nq-enun" name="enunciado" required></textarea></div>
      <div class="field"><label for="nq-gab">Gabarito ou resposta esperada</label><input class="input" id="nq-gab" name="gabarito" required placeholder="Ex.: B, ou f(x) = 3x + 2"></div>
      <footer class="dialog__actions"><button class="btn btn--quiet" type="button" data-dialog-close>Cancelar</button><button class="btn btn--primary" type="submit">Salvar questão</button></footer>
    </form>
  </dialog>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
