<?php
$titulo = 'Simulado em andamento';
$shell = 'aluno';
$ativo = 'simulados';
ob_start(); ?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js" defer></script>
  <script src="<?= url('assets/js/workspace.js') ?>" defer></script>
<?php $extra_head = ob_get_clean();
require __DIR__ . '/../../includes/topo.php';
?>

  <div class="exam-bar">
    <div class="container exam-bar__in">
      <div><b data-slot="simulado.titulo"></b> <small data-slot="simulado.posicao"></small></div>
      <!-- data-timer = segundos restantes; defina e chame Mathema.init(elemento) -->
      <span class="timer" data-timer="" data-on-end="fim" role="timer" aria-label="Tempo restante">--:--</span>
      <button class="btn btn--primary btn--sm" type="button" data-act="finalizar-simulado">Finalizar simulado</button>
    </div>
  </div>

  <main class="page container" style="padding-top: var(--s5)" data-question-id="">
    <section class="drafts" data-drafts="atual" aria-label="Rascunhos desta questão">
      <header class="drafts__head">
        <h4>Seus rascunhos nesta questão (<span data-count>0</span>)</h4>
        <button class="btn btn--quiet btn--sm" type="button" data-toggle-drafts>Ocultar</button>
      </header>
      <p class="drafts__empty">Nenhum rascunho salvo ainda.</p>
      <div class="drafts__list"></div>
    </section>

    <nav class="panel" style="margin-bottom: var(--s4)" aria-label="Navegação entre questões">
      <div class="qnav" data-list="simulado.navegacao"></div>
    </nav>

    <div class="split split--even" data-question>
      <article class="panel problem">
        <header class="problem__meta" data-list="simulado.tags"></header>
        <div class="problem__text" data-slot-html="simulado.enunciado_html"></div>
        <fieldset class="alts" style="border: 0; padding: 0; margin: var(--s5) 0 0">
          <legend class="sr-only">Alternativas</legend>
          <div style="display: contents" data-list="simulado.alternativas"></div>
        </fieldset>
        <p class="small muted" style="margin-top: var(--s4)">No simulado, o resultado aparece só no final.</p>
        <footer class="problem__foot">
          <button class="btn btn--quiet" type="button" data-act="questao-anterior">Anterior</button>
          <button class="btn" type="button" data-act="marcar-revisao">Marcar para revisar</button>
          <button class="btn btn--primary" type="button" data-act="salvar-proxima">Salvar e próxima</button>
        </footer>
      </article>

      <aside class="panel panel--flush pad" data-workspace="atual" aria-label="Espaço de rascunho">
        <div class="pad__tabs" role="tablist" aria-label="Tipo de rascunho">
          <button role="tab" type="button" aria-controls="s-draw" aria-selected="true">Desenho</button>
          <button role="tab" type="button" aria-controls="s-tex" aria-selected="false">LaTeX</button>
        </div>
        <div id="s-draw" role="tabpanel">
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
        <div id="s-tex" role="tabpanel" hidden>
          <label class="sr-only" for="s-tex-in">Código LaTeX</label>
          <textarea id="s-tex-in" name="s-tex-in" spellcheck="false" placeholder="Digite em LaTeX, por exemplo: 2(40 + 25) \cdot 80"></textarea>
          <div class="pad__preview" aria-live="polite"></div>
        </div>
        <footer class="pad__foot">
          <button class="btn btn--sm" type="button" data-save-draft>Salvar rascunho</button>
        </footer>
      </aside>
    </div>
  </main>

  <template data-template="simulado.navegacao">
    <a class="{classe}" href="#q{n}" data-n="{n}">{n}</a>
  </template>
  <template data-template="simulado.tags">
    <span class="tag {classe}">{texto}</span>
  </template>
  <template data-template="simulado.alternativas">
    <label class="alt"><input type="radio" name="resposta" value="{letra}" data-mark-done=".qnav .is-current"><b>{letra}</b><span>{texto}</span></label>
  </template>

  <dialog id="fim" aria-labelledby="fim-t">
    <h3 id="fim-t">Tempo esgotado</h3>
    <p class="muted">Enviamos suas respostas marcadas. Veja como foi.</p>
    <footer class="dialog__actions"><a class="btn btn--primary" href="simulado-resultado.php">Ver resultado</a></footer>
  </dialog>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
