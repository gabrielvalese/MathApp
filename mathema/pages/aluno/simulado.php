<?php
$titulo = 'Montar simulado';
$shell = 'aluno';
$ativo = 'simulados';
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container">
    <header class="page-head">
      <div>
        <h1>Monte seu simulado</h1>
        <p>Só a quantidade de questões é obrigatória. O resto você escolhe se quiser.</p>
      </div>
    </header>

    <form class="split" data-sim data-form="simulado-criar">
      <div class="grid">
        <section class="panel form">
          <div class="field">
            <label for="sim-qty">Quantidade de questões: <strong data-out-qty>20</strong></label>
            <input type="range" id="sim-qty" min="5" max="90" step="5" value="20">
          </div>
        </section>

        <section class="panel form">
          <div class="row row--between"><h3>Cronômetro</h3><label class="switch"><input type="checkbox" id="sim-timer" checked><i></i><span class="sr-only">Usar cronômetro</span></label></div>
          <div class="field"><label for="sim-mins">Tempo total, em minutos</label><input class="input" id="sim-mins" type="number" min="5" max="300" step="5" value="60" style="max-width: 160px"></div>
        </section>

        <section class="panel">
          <h3>Temas <span class="small muted" style="font-family: var(--f-body); font-weight: 400">· opcional</span></h3>
          <div class="chips" style="margin-top: var(--s3)">
            <label class="chip"><input type="checkbox" name="tema" value="Porcentagem"><span>Porcentagem</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Equações"><span>Equações</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Funções"><span>Funções</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Geometria plana"><span>Geometria plana</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Geometria espacial"><span>Geometria espacial</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Trigonometria"><span>Trigonometria</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Análise combinatória"><span>Análise combinatória</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Probabilidade"><span>Probabilidade</span></label>
            <label class="chip"><input type="checkbox" name="tema" value="Estatística"><span>Estatística</span></label>
          </div>
        </section>

        <section class="panel">
          <h3>Tipo de prova <span class="small muted" style="font-family: var(--f-body); font-weight: 400">· opcional</span></h3>
          <div class="chips" style="margin-top: var(--s3)">
            <label class="chip"><input type="checkbox" name="tipo" value="ENEM"><span>ENEM</span></label>
            <label class="chip"><input type="checkbox" name="tipo" value="Vestibulares"><span>Vestibulares</span></label>
            <label class="chip"><input type="checkbox" name="tipo" value="OBMEP"><span>OBMEP</span></label>
            <label class="chip"><input type="checkbox" name="tipo" value="OBM"><span>OBM</span></label>
            <label class="chip"><input type="checkbox" name="tipo" value="Concursos"><span>Concursos</span></label>
          </div>
        </section>
      </div>

      <aside class="panel panel--dark" style="position: sticky; top: calc(var(--header-h) + 16px)">
        <h3>Resumo</h3>
        <ul class="stack" style="margin-top: var(--s4)">
          <li data-sum-qty>20 questões</li>
          <li data-sum-time>60 minutos</li>
          <li data-sum-themes>Todos os temas</li>
          <li data-sum-types>Todos os tipos</li>
        </ul>
        <button class="btn btn--primary btn--block" type="submit" style="margin-top: var(--s5)">Começar simulado</button>
      </aside>
    </form>
  </main>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
