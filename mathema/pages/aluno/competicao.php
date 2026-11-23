<?php
$titulo = 'Desafio de Funções';
$shell = 'aluno';
$ativo = 'competicoes';
ob_start(); ?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js" defer></script>
  <script src="<?= url('assets/js/workspace.js') ?>" defer></script>
<?php $extra_head = ob_get_clean();
require __DIR__ . '/../../includes/topo.php';
?>

  <div class="exam-bar">
    <div class="container exam-bar__in">
      <div><b data-slot="competicao.titulo"></b> <small data-slot="competicao.professor"></small></div>
      <!-- data-timer = segundos restantes; defina e chame Mathema.init(elemento) -->
      <span class="timer" data-timer="" data-on-end="fim" role="timer" aria-label="Tempo restante">--:--</span>
      <button class="btn btn--primary btn--sm" type="button" data-act="enviar-tudo">Enviar tudo e sair</button>
    </div>
  </div>

  <main class="page container" style="padding-top: var(--s5)">
    <div class="notice" style="margin-bottom: var(--s4)">Quando o tempo acabar, enviamos automaticamente o que você já tem: rascunhos, textos e alternativas marcadas.</div>

    <!-- Uma aba e um painel por questão: renderList("competicao.abas") e renderList("competicao.paineis", ..., { template: "competicao.painel_aberta" | "competicao.painel_fechada", append: true }) -->
    <div class="tabs" role="tablist" data-tabs data-list="competicao.abas" aria-label="Questões da competição"></div>
    <div data-list="competicao.paineis"></div>
  </main>

  <template data-template="competicao.abas">
    <button role="tab" id="k-t{{questao_id}}" aria-controls="k-p{{questao_id}}" aria-selected="false">{{n}} · {{formato}}</button>
  </template>

  <!-- Questão aberta: rascunho em imagem e texto -->
  <template data-template="competicao.painel_aberta">
    <section id="k-p{{questao_id}}" role="tabpanel" aria-labelledby="k-t{{questao_id}}" data-question-id="{{questao_id}}" hidden>
      <section class="drafts" data-drafts="{{questao_id}}" aria-label="Rascunhos desta questão">
        <header class="drafts__head"><h4>Seus rascunhos nesta questão (<span data-count>0</span>)</h4><button class="btn btn--quiet btn--sm" type="button" data-toggle-drafts>Ocultar</button></header>
        <p class="drafts__empty">Nenhum rascunho salvo ainda.</p>
        <div class="drafts__list"></div>
      </section>

      <div class="split split--even">
        <article class="panel problem">
          <header class="problem__meta" data-list="competicao.tags"></header>
          <div class="problem__text">{{{enunciado_html}}}</div>
          <div class="field" style="margin-top: var(--s5)">
            <label for="resp-texto-{{questao_id}}">Sua resolução em texto</label>
            <textarea class="textarea" id="resp-texto-{{questao_id}}" name="texto" placeholder="Explique os passos e escreva a resposta final."></textarea>
          </div>
          <div class="field" style="margin-top: var(--s4)">
            <span class="label-text" id="up-l-{{questao_id}}">Foto do rascunho</span>
            <label class="dropzone" aria-labelledby="up-l-{{questao_id}}">
              <input type="file" name="imagens" accept="image/*" multiple data-upload="#up-prev-{{questao_id}}">
              <strong>Enviar imagem</strong>
              <span class="small" data-file-name>Foto ou captura do que você fez no papel</span>
            </label>
            <div class="previews" id="up-prev-{{questao_id}}"></div>
          </div>
          <footer class="problem__foot">
            <span class="small muted">Você pode reenviar até o fim do tempo.</span>
            <button class="btn btn--primary" type="button" data-act="enviar-resposta-aberta" data-id="{{questao_id}}">Enviar resposta</button>
          </footer>
        </article>

        <aside class="panel panel--flush pad" data-workspace="{{questao_id}}" aria-label="Espaço de rascunho">
          <div class="pad__tabs" role="tablist" aria-label="Tipo de rascunho">
            <button role="tab" type="button" aria-controls="k-draw-{{questao_id}}" aria-selected="true">Desenho</button>
            <button role="tab" type="button" aria-controls="k-tex-{{questao_id}}" aria-selected="false">LaTeX</button>
          </div>
          <div id="k-draw-{{questao_id}}" role="tabpanel">
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
          <div id="k-tex-{{questao_id}}" role="tabpanel" hidden>
            <label class="sr-only" for="k-tex-in-{{questao_id}}">Código LaTeX</label>
            <textarea id="k-tex-in-{{questao_id}}" name="k-tex-in-{{questao_id}}" spellcheck="false" placeholder="Digite em LaTeX"></textarea>
            <div class="pad__preview" aria-live="polite"></div>
          </div>
          <footer class="pad__foot"><button class="btn btn--sm" type="button" data-save-draft>Salvar rascunho</button></footer>
        </aside>
      </div>
    </section>
  </template>

  <!-- Questão fechada -->
  <template data-template="competicao.painel_fechada">
    <section id="k-p{{questao_id}}" role="tabpanel" aria-labelledby="k-t{{questao_id}}" data-question-id="{{questao_id}}" hidden>
      <div class="split split--even">
        <article class="panel problem" data-question>
          <header class="problem__meta" data-list="competicao.tags"></header>
          <div class="problem__text">{{{enunciado_html}}}</div>
          <fieldset class="alts" style="border: 0; padding: 0; margin: var(--s5) 0 0">
            <legend class="sr-only">Alternativas</legend>
            <div style="display: contents" data-list="competicao.alternativas"></div>
          </fieldset>
          <footer class="problem__foot"><span class="small muted">A correção sai quando a competição acabar.</span><button class="btn btn--primary" type="button" data-act="enviar-resposta-fechada" data-id="{{questao_id}}">Enviar resposta</button></footer>
        </article>
        <aside class="panel">
          <h3>Como funciona</h3>
          <p class="muted" style="margin-top: 8px">Nas questões fechadas, marque a alternativa e envie. As abertas aceitam texto, desenho e foto do rascunho.</p>
        </aside>
      </div>
    </section>
  </template>
  <template data-template="competicao.tags">
    <span class="tag {{classe}}">{{texto}}</span>
  </template>
  <template data-template="competicao.alternativas">
    <label class="alt"><input type="radio" name="resposta-{{questao_id}}" value="{{letra}}"><b>{{letra}}</b><span>{{texto}}</span></label>
  </template>

  <dialog id="fim" aria-labelledby="fim-t">
    <h3 id="fim-t">Tempo esgotado</h3>
    <p class="muted">Enviamos o que você já tinha feito. O ranking sai quando o professor encerrar a correção.</p>
    <footer class="dialog__actions"><a class="btn btn--primary" href="competicoes.php">Voltar às competições</a></footer>
  </dialog>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
