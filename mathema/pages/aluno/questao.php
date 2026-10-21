<?php
$titulo = 'Questão';
$shell = 'aluno';
$ativo = 'trilha';
ob_start(); ?>
  <!-- KaTeX para a pré-visualização do LaTeX (opcional: sem ele o texto aparece sem formatação) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js" defer></script>
  <script src="<?= url('assets/js/workspace.js') ?>" defer></script>
<?php $extra_head = ob_get_clean();
require __DIR__ . '/../../includes/topo.php';
?>

  <main class="page container" data-question-id="">
    <nav class="crumbs" aria-label="Você está em"><a href="trilha.php">Trilha</a><a href="trilha-final.php" data-slot="questao.lista_titulo"></a><span data-slot="questao.numero_label"></span></nav>

    <!-- Espaço acima da questão para rever rascunhos (lista vem de Mathema.workspace.setDrafts("atual", [...])) -->
    <section class="drafts" data-drafts="atual" aria-label="Rascunhos desta questão">
      <header class="drafts__head">
        <h4>Seus rascunhos nesta questão (<span data-count>0</span>)</h4>
        <button class="btn btn--quiet btn--sm" type="button" data-toggle-drafts>Ocultar</button>
      </header>
      <p class="drafts__empty">Nenhum rascunho salvo ainda. Use o espaço ao lado e clique em “Salvar rascunho” para guardá-lo aqui.</p>
      <div class="drafts__list"></div>
    </section>

    <div class="split split--even" data-question>
      <!-- Enunciado -->
      <article class="panel problem">
        <header class="problem__meta" data-list="questao.tags"></header>
        <div class="problem__text" data-slot-html="questao.enunciado_html"></div>
        <figure data-slot-html="questao.figura_html"></figure>

        <fieldset class="alts" style="border: 0; padding: 0; margin: var(--s5) 0 0">
          <legend class="sr-only">Alternativas</legend>
          <div style="display: contents" data-list="questao.alternativas"></div>
        </fieldset>
        <div data-result hidden role="status"></div>

        <footer class="problem__foot">
          <a class="btn btn--quiet" href="trilha-final.php">Voltar à lista</a>
          <button class="btn btn--primary" type="button" data-check>Enviar resposta</button>
        </footer>
      </article>

      <!-- Rascunho -->
      <aside class="panel panel--flush pad" data-workspace="atual" aria-label="Espaço de rascunho">
        <div class="pad__tabs" role="tablist" aria-label="Tipo de rascunho">
          <button role="tab" type="button" aria-controls="q-draw" aria-selected="true">Desenho</button>
          <button role="tab" type="button" aria-controls="q-tex" aria-selected="false">LaTeX</button>
        </div>
        <div id="q-draw" role="tabpanel">
          <div class="pad__bar">
            <button class="tool" type="button" data-tool="pen" data-color="#1a1a1c" aria-pressed="true" aria-label="Caneta grafite"><i style="color:#1a1a1c"></i></button>
            <button class="tool" type="button" data-tool="pen" data-color="#ff5a1f" aria-pressed="false" aria-label="Caneta laranja"><i style="color:#ff5a1f"></i></button>
            <button class="tool" type="button" data-tool="eraser" aria-pressed="false">Borracha</button>
            <span class="tool-sep"></span>
            <button class="tool" type="button" data-tool="undo">Desfazer</button>
            <button class="tool" type="button" data-tool="clear">Limpar</button>
          </div>
          <canvas aria-label="Área de desenho. Use mouse, caneta ou toque."></canvas>
        </div>
        <div id="q-tex" role="tabpanel" hidden>
          <label class="sr-only" for="q-tex-in">Código LaTeX</label>
          <textarea id="q-tex-in" name="q-tex-in" spellcheck="false" placeholder="Digite em LaTeX, por exemplo: 6 + 2{,}5x = 31"></textarea>
          <div class="pad__preview" aria-live="polite"></div>
        </div>
        <footer class="pad__foot">
          <button class="btn btn--sm" type="button" data-save-draft>Salvar rascunho</button>
          <span class="small faint">O rascunho não afeta sua nota.</span>
        </footer>
      </aside>
    </div>
  </main>

  <template data-template="questao.tags">
    <span class="tag {{classe}}">{{texto}}</span>
  </template>
  <template data-template="questao.alternativas">
    <label class="alt"><input type="radio" name="resposta" value="{{letra}}"><b>{{letra}}</b><span>{{texto}}</span></label>
  </template>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
