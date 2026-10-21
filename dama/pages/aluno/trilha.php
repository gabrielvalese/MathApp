<?php
$titulo = 'Trilha de aprendizado';
$shell = 'aluno';
$ativo = 'trilha';
require __DIR__ . '/../../includes/topo.php';
?>

<main class="page container">
  <header class="page-head">
    <div>
      <h1>Trilha de aprendizado</h1>
      <p>
        Explore os macrotemas da Matemática, resolva problemas
        e acompanhe seu progresso em cada área.
      </p>
    </div>
  </header>

  <section class="trilha-catalogo" aria-labelledby="titulo-macrotemas">
    <header class="section-head">
      <h2 id="titulo-macrotemas">Macrotemas</h2>
      <p>Escolha uma área para visualizar seus problemas.</p>
    </header>

    <!-- A GRADE COMEÇA AQUI E FICA DENTRO DO CONTAINER -->
    <div class="macro-grid" data-list="trilha.macrotemas">
      <article class="macro-card">
        <a class="macro-card__link" href="trilha-tema.php?tema=numeros">
          <header class="macro-card__head">
            <span class="macro-card__numero">01</span>
            <span class="macro-card__icone" aria-hidden="true">∑</span>
          </header>
          <h3>Números, aritmética e matemática financeira</h3>
          <p>Operações, porcentagens, juros, sequências e medidas.</p>
          <footer class="macro-card__footer">
            <span>8 subtópicos</span>
            <span class="macro-card__seta" aria-hidden="true">→</span>
          </footer>
        </a>
      </article>

      <article class="macro-card">
        <a class="macro-card__link" href="trilha-tema.php?tema=algebra">
          <header class="macro-card__head">
            <span class="macro-card__numero">02</span>
            <span class="macro-card__icone" aria-hidden="true">ƒ</span>
          </header>
          <h3>Álgebra, funções e modelagem</h3>
          <p>Equações, funções, gráficos e modelagem matemática.</p>
          <footer class="macro-card__footer">
            <span>7 subtópicos</span>
            <span class="macro-card__seta" aria-hidden="true">→</span>
          </footer>
        </a>
      </article>

      <article class="macro-card">
        <a class="macro-card__link" href="trilha-tema.php?tema=geometria">
          <header class="macro-card__head">
            <span class="macro-card__numero">03</span>
            <span class="macro-card__icone" aria-hidden="true">△</span>
          </header>
          <h3>Geometria, grandezas e medidas</h3>
          <p>Figuras, áreas, volumes e transformações geométricas.</p>
          <footer class="macro-card__footer">
            <span>9 subtópicos</span>
            <span class="macro-card__seta" aria-hidden="true">→</span>
          </footer>
        </a>
      </article>

      <article class="macro-card">
        <a class="macro-card__link" href="trilha-tema.php?tema=probabilidade">
          <header class="macro-card__head">
            <span class="macro-card__numero">04</span>
            <span class="macro-card__icone" aria-hidden="true">◇</span>
          </header>
          <h3>Probabilidade e combinatória</h3>
          <p>Contagem, agrupamentos e eventos aleatórios.</p>
          <footer class="macro-card__footer">
            <span>5 subtópicos</span>
            <span class="macro-card__seta" aria-hidden="true">→</span>
          </footer>
        </a>
      </article>

      <article class="macro-card">
        <a class="macro-card__link" href="trilha-tema.php?tema=estatistica">
          <header class="macro-card__head">
            <span class="macro-card__numero">05</span>
            <span class="macro-card__icone" aria-hidden="true">▥</span>
          </header>
          <h3>Estatística e análise de dados</h3>
          <p>Pesquisas, gráficos, médias e dispersão.</p>
          <footer class="macro-card__footer">
            <span>4 subtópicos</span>
            <span class="macro-card__seta" aria-hidden="true">→</span>
          </footer>
        </a>
      </article>
    </div>
    <!-- FIM DA GRADE -->

  </section>
</main>

<script src="/assets/js/trilha.js" defer></script>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>