<?php
$titulo = 'Salas';
$shell = 'aluno';
$ativo = 'salas';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div>
        <h1>Salas</h1>
        <p>Entre na sala do seu professor com o código de 6 caracteres. Só professores criam salas.</p>
      </div>
    </header>

    <section class="panel panel--tint" style="margin-bottom: var(--s6)">
      <form class="form" data-form="entrar-sala" style="max-width: 520px">
        <div class="field"><label for="codigo">Código da sala</label>
          <div class="join"><input class="input" id="codigo" name="codigo" maxlength="6" minlength="6" required placeholder="K7M2QX" autocomplete="off"><button class="btn btn--dark" type="submit">Entrar na sala</button></div>
          <span class="hint">Peça o código ao seu professor.</span></div>
      </form>
    </section>

    <h2 style="font-size: 1.5rem; margin-bottom: var(--s4)">Suas salas</h2>
    <div class="grid cols-2" data-list="aluno.salas"></div>
  </main>

  <template data-template="aluno.salas">
    <a class="room-card" href="sala.php?id={{id}}">
      <div class="row row--between"><h3>{{nome}}</h3><span class="tag {{status_class}}">{{status}}</span></div>
      <p class="small muted">{{professor}} · {{alunos}} alunos</p>
      <div><div class="row row--between small muted" style="margin-bottom: 6px"><span>Atividades concluídas</span><span>{{concluidas}} de {{total}}</span></div><div class="meter"><i style="width: {{pct}}%"></i></div></div>
    </a>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
