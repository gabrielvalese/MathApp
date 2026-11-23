<?php
$titulo = 'Mathema · Matemática que evolui com você';
$shell = 'public';
$ativo = '';
ob_start(); ?>
  <meta name="description" content="Plataforma de Matemática para o Ensino Médio com trilhas, simulados, salas de professores e competições, alinhada à BNCC.">
<?php $extra_head = ob_get_clean();
require __DIR__ . '/includes/topo.php';
?>

  <main>
    <section class="hero grid-paper">
      <div class="container hero__in">
        <div>
          <h1>DAMA: <span>Descomplicando A Matemática</span></h1>
          <p class="hero__lede">Ecossistema para aprendizado de Matemática para Alunos do Ensino Médio e interação com professores.</p>
          <div class="row">
            <a class="btn btn--primary" href="pages/auth/cadastro-aluno.php">Começar como aluno</a>
            <a class="btn" href="pages/auth/cadastro-professor.php">Sou professor</a>
          </div>
    </section>

    <div class="facts container" aria-label="Em números">
      <div><b>Exercícios</b><span>Modelados com base na BNCC</span></div>
      <div><b>Aprendizado Prático</b><span>com questões dinâmicas</span></div>
      <div><b>Salas de Aula</b><span>para relação entre aluno e professor</span></div>
      <div><b>Espaço de Competição e Simulados</b><span>para o aprendizado ativo da matemática</span></div>
    </div>

    <section class="sec" id="o-que-e">
      <div class="container sec__grid">
        <header><h2>O que é a Mathema</h2></header>
        <div class="prose">
          <p>A Mathema é uma plataforma web de <strong>Matemática do Ensino Médio</strong>. Ela reúne, no mesmo lugar, trilhas de aprendizagem organizadas pela BNCC, exercícios adaptativos, simulados, salas criadas por professores e competições com ranking.</p>
          <p>Cada questão tem um espaço de rascunho próprio, onde você escreve em LaTeX ou desenha com o mouse ou o dedo. Seu raciocínio fica registrado e pode ser revisto depois.</p>
        </div>
      </div>
    </section>

    <section class="sec" id="justificativa">
      <div class="container sec__grid">
        <header><h2>Por que ela existe</h2></header>
        <div class="prose">
          <p>Muita gente chega às provas de concursos e olimpíadas sabendo repetir um método, mas sem reconhecer quando usá-lo. O problema quase nunca é a conta. É interpretar o enunciado.</p>
          <p>Por isso as questões finais de cada trilha só trazem conteúdos que você já estudou, em formatos de provas reais. Assim você enfrenta o problema com o que sabe, em vez de decorar um caminho.</p>
          <p>Para o professor, a plataforma devolve o que costuma faltar: ver o rascunho de cada aluno, não só a resposta final.</p>
        </div>
      </div>
    </section>

    <section class="sec" id="recursos">
      <div class="container sec__grid">
        <header><h2>O que você encontra aqui</h2><p>Tudo o que o aluno e o professor usam no dia a dia.</p></header>
        <ul class="feat">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18h6a4 4 0 0 0 0-8h-2a4 4 0 0 1 0-8h6"/></svg><div><h3>Trilha de aprendizado</h3><p>Macro-categorias da BNCC, ramificações com 10 questões cada e questões finais que misturam os temas.</p></div></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16z"/></svg><div><h3>Rascunho com LaTeX e desenho</h3><p>Digite fórmulas ou desenhe com mouse e toque. Seus rascunhos ficam salvos acima de cada questão.</p></div></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg><div><h3>Simulados sob medida</h3><p>Escolha quantidade de questões, temas, provas e cronômetro. No fim, veja o desempenho por conteúdo.</p></div></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18M5 20V9l7-5 7 5v11M10 20v-6h4v6"/></svg><div><h3>Salas de professores</h3><p>Entre com um código e receba atividades visíveis só para a sua turma.</p></div></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/></svg><div><h3>Competições e ranking</h3><p>Provas com tempo limite criadas por professores, com questões abertas e fechadas.</p></div></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg><div><h3>Análise de perfil</h3><p>Trilha de dias de estudo, gráfico de rosca por prova e teia por tema.</p></div></li>
        </ul>
      </div>
    </section>

    <section class="sec" id="como-funciona">
      <div class="container sec__grid">
        <header><h2>Como funciona</h2></header>
        <ol class="flow">
          <li><div><h3>Crie sua conta</h3><p>Entre com o Google ou com seu e-mail. Você recebe um código para confirmar o cadastro.</p></div></li>
          <li><div><h3>Siga a trilha</h3><p>Resolva as 10 questões de cada ramificação. Se errar, a questão volta até você acertar.</p></div></li>
          <li><div><h3>Teste o que aprendeu</h3><p>Faça as questões finais, monte simulados e participe de competições da sua escola.</p></div></li>
        </ol>
      </div>
    </section>

    <section class="sec" id="professores">
      <div class="container sec__grid">
        <header><h2>Para professores</h2></header>
        <div class="prose">
          <p>Crie salas com código de acesso (até 100 alunos), publique atividades do seu banco ou do banco da plataforma e acompanhe o desempenho da turma em gráficos.</p>
          <p>O acesso de professor é validado por nossa equipe: você envia o e-mail institucional e uma imagem do currículo que comprove a atuação docente.</p>
          <p style="margin-top: var(--s5)"><a class="btn" href="pages/auth/cadastro-professor.php">Solicitar acesso de professor</a></p>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container cta__in">
        <div>
          <h2>Sua próxima questão começa aqui.</h2>
          <p>Cadastro gratuito para alunos. Leva um minuto.</p>
        </div>
        <div class="row">
          <a class="btn btn--primary" href="pages/auth/cadastro-aluno.php">Criar conta</a>
          <a class="btn" href="pages/auth/login-aluno.php">Já tenho conta</a>
        </div>
      </div>
    </section>
  </main>
<?php require __DIR__ . '/includes/rodape.php'; ?>
