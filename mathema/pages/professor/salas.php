<?php
$titulo = 'Salas de aula';
$shell = 'professor';
$ativo = 'salas';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div>
        <h1>Suas salas de aula</h1>
        <p>Cada sala tem um código de acesso e comporta até 100 alunos.</p>
      </div>
      <div class="page-head__actions"><button class="btn btn--primary" type="button" data-dialog-open="nova-sala">Criar sala</button></div>
    </header>

    <div class="grid cols-3" data-list="professor.salas"></div>
  </main>

  <template data-template="professor.salas">
    <a class="room-card" href="sala.php?id={{id}}">
      <div class="row row--between"><h3>{{nome}}</h3><span class="code-pill">{{codigo}}</span></div>
      <div><div class="row row--between small muted" style="margin-bottom: 6px"><span>Alunos</span><span>{{alunos}} de {{limite}}</span></div><div class="meter"><i style="width: {{pct}}%"></i></div></div>
      <p class="small muted">{{atividades}} atividades · média da turma {{media}}%</p>
    </a>
  </template>

  <dialog id="nova-sala" aria-labelledby="ns-t">
    <form class="form" data-form="criar-sala">
      <h3 id="ns-t">Criar sala</h3>
      <div class="field"><label for="ns-nome">Nome da sala</label><input class="input" id="ns-nome" name="nome" required placeholder="Ex.: 2º Ano C · Matemática"></div>
      <div class="field">
        <span class="label-text">Código de acesso</span>
        <div class="panel" style="padding: var(--s4); text-align: center"><div class="code-box" id="ns-code" data-slot="sala.codigo_novo">------</div></div>
        <div class="row row--between"><span class="hint">Os alunos usam este código para entrar. Máximo de 100 alunos.</span><button class="btn btn--quiet btn--sm" type="button" data-act="gerar-codigo">Gerar outro</button></div>
      </div>
      <footer class="dialog__actions"><button class="btn btn--quiet" type="button" data-dialog-close>Cancelar</button><button class="btn btn--primary" type="submit">Criar sala</button></footer>
    </form>
  </dialog>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
