<?php
require_once __DIR__ . '/../back/config.php';

session_start();
$logado = isset($_SESSION['usuario']);

if($logado) {
  
  if($_SESSION['tipo_conta'] === 'estudante') {
    $mysqli = conecta_banco();
    $email = $_SESSION['usuario'];

    $consulta = $mysqli->prepare('SELECT nome, email, nascimento FROM Estudante WHERE email = ?');
    $consulta->bind_param('s', $email);
    $consulta->execute();
    $aluno = $consulta->get_result()->fetch_assoc();
    $consulta->close();
  } elseif($_SESSION['tipo_conta'] === 'professor') {
    $mysqli = conecta_banco();
    $email = $_SESSION['usuario'];

    $consulta = $mysqli->prepare('SELECT nome, email, nascimento FROM Professor WHERE email = ?');
    $consulta->bind_param('s', $email);
    $consulta->execute();
    $aluno = $consulta->get_result()->fetch_assoc();
    $consulta->close();
  }
}

?>
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0B132B" />
    <meta name="description" content="DAMA — Descomplicando a Matemática. Problemas por conteúdo e simulados personalizados do básico ao avançado." />
    <title>DAMA | Descomplicando a Matemática</title>
    <link rel="stylesheet" href="assets/style.css">
    <script src="assets/app.js" defer></script>
  </head>
  <body>
    <svg class="svg-sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></symbol>
      <symbol id="i-layers" viewBox="0 0 24 24"><path d="m12 2-9 5 9 5 9-5-9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"/></symbol>
      <symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></symbol>
      <symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M16 3.2a4 4 0 0 1 0 7.6M23 21v-2a4 4 0 0 0-3-3.87"/><circle cx="8.5" cy="7" r="4"/></symbol>
      <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
      <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
      <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
      <symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 3 2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1L12 3Z"/></symbol>
      <symbol id="i-logout" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></symbol>
      <symbol id="i-list" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></symbol>
      <symbol id="i-cap" viewBox="0 0 24 24"><path d="m2 10 10-6 10 6-10 6-10-6ZM6 12v6c3.6 2.4 8.4 2.4 12 0v-6M22 10v7"/></symbol>
      <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" 
      rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></symbol>
      <symbol id="i-pencil" viewBox="0 0 24 24"><path d="m15 5 4 4M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15l-1 5z"fill="none" stroke="currentColor" stroke-width="2"stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v6m4-6v6"fill="none"stroke="currentColor" stroke-width="2"stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-bolt" viewBox="0 0 24 24"><path d="m13 2-9 12h7l-1 8 10-12h-7l0-8Z"/></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
      <symbol id="i-network" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="12" cy="13" r="2"/><path d="M12 6v5M11 15l-5 2M13 15l5 2"/></symbol>
      <symbol id="i-ellipse" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="5"/><path d="M12 3v18M3 12h18"/></symbol>
      <symbol id="i-venn" viewBox="0 0 24 24"><circle cx="9" cy="12" r="7"/><circle cx="15" cy="12" r="7"/></symbol>
      <symbol id="i-infinity" viewBox="0 0 24 24"><path d="M12 12C9.5 8 7.7 7 5.5 7a5 5 0 0 0 0 10c2.2 0 4-1 6.5-5Zm0 0c2.5-4 4.3-5 6.5-5a5 5 0 0 1 0 10c-2.2 0-4-1-6.5-5Z"/></symbol>
      <symbol id="i-chart" viewBox="0 0 24 24"><path d="M3 20h18M6 16v-5M11 16V7M16 16v-9M21 16V4"/></symbol>
      <symbol id="i-line-chart" viewBox="0 0 24 24"><path d="M3 3v18h18M6 17l5-5 4 2 5-9"/></symbol>
      <symbol id="i-curve" viewBox="0 0 24 24"><path d="M3 3v18h18M5 19C12 19 17 16 20 4"/></symbol>
      <symbol id="i-parabola" viewBox="0 0 24 24"><path d="M3 12h18M12 2v20M4 4c2 10 5 14 8 14s6-4 8-14"/></symbol>
      <symbol id="i-function" viewBox="0 0 24 24"><text x="2" y="17" fill="currentColor" stroke="none" font-size="14" font-weight="700" font-family="Georgia,serif">f(x)</text></symbol>
      <symbol id="i-axis" viewBox="0 0 24 24"><path d="M3 20h18M12 22V2M7 16l10-10M18 6h-5M18 6v5"/></symbol>
      <symbol id="i-cube" viewBox="0 0 24 24"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10"/></symbol>
      <symbol id="i-triangle" viewBox="0 0 24 24"><path d="M12 3 22 20H2L12 3ZM12 16v.02"/></symbol>
      <symbol id="i-percent" viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M4 20 20 4"/></symbol>
      <symbol id="i-dice" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/></symbol>
      <symbol id="i-calculator" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><rect x="8" y="5" width="8" height="4" rx="1"/><path d="M9 13h1M14 13h1M9 17h1M14 17h1"/></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></symbol>
      <symbol id="i-absolute" viewBox="0 0 24 24"><path d="M6 3v18M18 3v18M10 17l4-10"/></symbol>
      <symbol id="i-log" viewBox="0 0 24 24"><text x="1" y="17" fill="currentColor" stroke="none" font-size="11" font-weight="700" font-family="Georgia,serif">log</text></symbol>
      <symbol id="i-sigma" viewBox="0 0 24 24"><text x="4" y="18" fill="currentColor" stroke="none" font-size="21" font-family="Georgia,serif">Σ</text></symbol>
      <symbol id="i-sequence" viewBox="0 0 24 24"><path d="M3 7h2M3 12h2M3 17h2M9 7h12M9 12h12M9 17h12"/></symbol>
    </svg>

    <!-- ACESSO: esta tela é apenas demonstrativa e não autentica usuários. -->
    
    <?php if (!$logado): ?>
    <main id="authView" class="auth-layout">
      <aside class="brand-panel" aria-label="Apresentação DAMA">
        <header class="brand-panel__top">
          <a class="brand brand--light" href="#" aria-label="DAMA, início">
            <span class="brand__symbol" aria-hidden="true">D</span>
            <span>DAMA</span>
          </a>
        </header>

        <section class="brand-panel__body" aria-label="Sobre a DAMA">
          <span class="eyebrow eyebrow--on-dark"><span class="eyebrow__line"></span> DO BÁSICO AO AVANÇADO</span>
          <h1>Descomplicando a <span>matemática.</span><br />Do básico ao avançado.</h1>
          <p>Estude no seu ritmo, enfrente novos desafios e transforme cada questão em uma conquista.</p>

          <div class="brand-panel__features">
            <span><svg class="icon"><use href="#i-check"></use></svg> Questões por assunto</span>
            <span><svg class="icon"><use href="#i-check"></use></svg> Simulados personalizados</span>
          </div>
        </section>

        <footer class="brand-panel__footer"><span>© 2026 DAMA</span><span>Feito para quem quer aprender.</span></footer>
      </aside>

      <section class="auth-panel" aria-labelledby="authHeading">
        <header class="auth-panel__top">
          <span class="auth-panel__breadcrumb">PLATAFORMA DE APRENDIZADO <span class="dot"></span> ENEM & VESTIBULARES</span>
          <span class="auth-panel__mobile-logo">D <b>DAMA</b></span>
        </header>

        <article class="auth-card" aria-labelledby="authHeading">
          <header class="auth-card__intro">
            <span class="eyebrow">BEM-VINDO À DAMA</span>
            <h2 id="authHeading">Bom ter você de volta.</h2>
            <p id="authDescription">Entre na sua conta e continue de onde parou.</p>
          </header>

          <div class="auth-tabs" role="tablist" aria-label="Acesso à plataforma">
            <button id="entrar_conta" class="auth-tabs__button is-active" type="button" role="tab" aria-selected="true" aria-controls="loginForm">Entrar</button>
            <button id="criar_conta" class="auth-tabs__button" type="button" role="tab" aria-selected="false" aria-controls="registerForm">Criar conta</button>
          </div>

          <div class="role-picker" aria-label="Tipo de usuário">
            <p>Você vai acessar como</p>
            <div class="role-picker__buttons">
              <button class="role-button is-selected" id="aluno" type="button" data-role="estudante" aria-pressed="true">
                <svg class="icon"><use href="#i-cap"></use></svg> Aluno
              </button>
              <button class="role-button" id="professor" type="button" data-role="professor" aria-pressed="false">
                <svg class="icon"><use href="#i-users"></use></svg> Professor
              </button>
            </div>
          </div>

          <form id="formulario_login" class="form-stack" novalidate action="/Projeto_Final/back/valida_login.php"  method="post">
            <input type="hidden" id ="perfil_login" name="perfil" value="estudante" />
            <label class="form-label">E-mail
              <input id="loginEmail" type="email" name="email" autocomplete="username" placeholder="seuemail@exemplo.com" required />
            </label>
            <label class="form-label">Senha
              <span class="input-with-action">
                <input id="senha_login" type="password" name="senha" autocomplete="current-password" placeholder="Digite sua senha" minlength="6" required />
                <button type="button" id="mostrar_senha" class="show-password" data-target="loginPassword" aria-label="Mostrar senha">Mostrar</button>
              </span>
            </label>
            <div class="form-options"><label class="checkbox-label"><input type="checkbox" name="lembrar"  id="lembrar"/> Lembrar de mim</label><span class="form-options__hint">Acesso seguro</span></div>
            <p id="erro_login" class="form-error" role="alert"></p>
            <button type="submit" id="botao_entrar" class="button button--primary button--full">Entrar<svg class="icon"><use href="#i-chevron"></use></svg></button>
          </form>

          <form id="formulario_registro" action="../back/cadastro.php" class="form-stack" hidden novalidate method="post">
            <input type="hidden" id ="perfil_registro" name="perfil" value="estudante" />
            <div class="form-row">
              <label class="form-label">Nome completo
                <input id="nome" type="text" name="nome" autocomplete="name" placeholder="Como podemos te chamar?" minlength="3" required />
              </label>
              <label class="form-label">Nascimento
                <input id="nascimento" type="date" name="nascimento" autocomplete="bday" required />
              </label>
            </div>
            <label class="form-label">E-mail
              <input id="email" type="email" name="email" autocomplete="email" placeholder="seuemail@exemplo.com" required />
            </label>
            <div class="form-row">
              <label class="form-label">Senha
                <input id="senha" type="password" name="senha" autocomplete="new-password" placeholder="Mínimo 6 caracteres" minlength="6" required />
              </label>
              <label class="form-label">Confirmar senha
                <input id="confirma_senha" type="password" name="confirmar_senha" autocomplete="new-password" placeholder="Repita a senha" minlength="6" required />
              </label>
            </div>
            <p id="erro_senha" class="form-error" role="alert"></p>
            <p id="cadastro_sucesso" class="form-success" role="status"></p>
            <button type="submit" id="botao_criar_conta"class="button button--primary button--full">Criar conta <svg class="icon"><use href="#i-chevron"></use></svg></button>
          </form> 
        </article>

        <footer class="auth-panel__footer">Aprenda • Pratique • Evolua <span>DAMA — Descomplicando a Matemática.</span></footer>
      </section>
    </main>
      <?php else: ?>
    <!-- PLATAFORMA: os dados serão substituídos por resultados do PHP/MySQL. -->
     <?php   $partes = preg_split('/\s+/', trim($aluno['nome'] ?? ''));
             $primeiro_nome = $partes[0] ?? '';
             $inicial = mb_strtoupper(mb_substr($primeiro_nome, 0, 1, 'UTF-8'), 'UTF-8');

      ?> 
    
    <div id="appView" class="app-layout">
      <header class="site-header">
        <div class="site-header__inner">
          <a href="#inicio" id="headerLogo" class="brand brand--dark"><span class="brand__symbol" aria-hidden="true">D</span><span>DAMA</span></a>
          <button id="mobileMenuButton" class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="mainNav" aria-label="Abrir menu"><svg class="icon"><use href="#i-menu"></use></svg></button>
          <nav id="mainNav" class="main-nav" aria-label="Navegação principal">
            <button type="button" data-page="inicio" id="botao_inicio" class="nav-link is-active"><svg class="icon"><use href="#i-grid"></use></svg> Início</button>
            <button type="button" data-page="simulados" id="botao_simulados" class="nav-link"><svg class="icon"><use href="#i-target"></use></svg> Simulados</button>
            <button type="button" data-page="problemas" id="botao_problemas" class="nav-link"><svg class="icon"><use href="#i-book"></use></svg> Problemas</button>
            <button type="button" data-page="perfil" id="botao_perfil" class="nav-link"><svg class="icon"><use href="#i-user"></use></svg> Perfil</button>
          </nav>
          <aside class="site-header__user" aria-label="Conta atual"><span class="user-avatar" id="userAvatar"><?php print($inicial) ?></span><span class="site-header__user-label"><strong id="userName"> <?php print($primeiro_nome) ?></strong><small id="userRole"> <?php print(ucfirst($_SESSION['tipo_conta'])) ?> </small></span><form action="/Projeto_Final/back/sair.php" method="post">
    <button type="submit" class="icon-button" aria-label="Sair">
        <svg class="icon" aria-hidden="true"><use href="#i-logout"></use></svg>
    </button>
</form></button></aside>
        </div>
      </header>


      <main class="app-main">
        <section class="app-page is-active" id="tela_inicio" data-screen="inicio" aria-labelledby="homeHeading">
          <header class="welcome-heading">
            <span class="eyebrow"><span class="eyebrow__line" aria-hidden="true"></span> BEM-VINDO AO SEU ESPAÇO</span>
            <h1 id="homeHeading">Seu próximo acerto começa aqui.</h1>
            <p id="welcomeText">Organize seus estudos, pratique com questões e avance na matemática do seu jeito.</p>
            <div class="welcome-heading__hint"><svg class="icon" aria-hidden="true"><use href="#i-book"></use></svg><span>Escolha abaixo como deseja estudar.</span></div>
          </header>
          <header class="section-heading"><div><span class="eyebrow">EXPERIMENTE A PLATAFORMA</span><h2>O que você quer fazer hoje?</h2></div><span class="section-heading__note">Escolha por onde começar</span></header>
          <nav class="action-grid" aria-label="Acesso rápido a simulados e problemas">
            <button type="button" class="action-card" id="botao_inicio_simulados" data-go="simulados"><span class="action-card__icon action-card__icon--orange"><svg class="icon"><use href="#i-target"></use></svg></span><strong>Criar simulado</strong><span>Escolha os conteúdos, a quantidade de questões e o tempo.</span><span class="action-card__cta">Começar <svg class="icon"><use href="#i-chevron"></use></svg></span></button>
            <button type="button" class="action-card" id="botao_inicio_problemas" data-go="problemas"><span class="action-card__icon action-card__icon--blue"><svg class="icon"><use href="#i-book"></use></svg></span><strong>Resolver problemas</strong><span>Pratique matemática com exercícios e desafios.</span><span class="action-card__cta">Explorar <svg class="icon"><use href="#i-chevron"></use></svg></span></button>
          </nav>
          <aside class="info-strip"><span class="info-strip__badge"><svg class="icon"><use href="#i-spark"></use></svg></span><div><strong>Seu ambiente de estudo, do seu jeito.</strong><p>As questões e o progresso vão aparecer aqui quando conectarmos o banco.</p></div><span class="pill">Prévia do sistema</span></aside>
        </section>

        <section class="app-page" id="tela_simulados" data-screen="simulados" aria-labelledby="simuladosHeading">
          <header class="page-heading"><div><span class="eyebrow">PREPARE-SE PARA O PRÓXIMO DESAFIO</span><h1 id="simuladosHeading">Simulados</h1><p>Configure seu simulado com os assuntos que deseja praticar.</p></div><span class="page-heading__icon"><svg class="icon"><use href="#i-target"></use></svg></span></header>
          <nav class="section-tabs" aria-label="Seções de simulados"><button type="button" id="criar_simulados" class="section-tab is-active" data-sim-tab="criar">Criar simulado</button><button type="button" class="section-tab" id="meus_simulados" data-sim-tab="meus">Meus simulados</button></nav>
          <section id="criar_simulados_aba" class="content-panel" aria-label="Criar simulado">
            <form id="simuladoForm" class="exam-form">
              <header class="panel-heading"><div><h2>Personalize sua prática</h2><p>Selecione os conteúdos e defina as opções do seu simulado.</p></div><span class="pill pill--orange"><svg class="icon"><use href="#i-spark"></use></svg> Do seu jeito</span></header>
              <label class="form-label">Nome do simulado <span class="optional">(opcional)</span><input id="examName" type="text" name="nome" placeholder="Ex.: Revisão de matemática" maxlength="80" /></label>
              <header class="topics-heading"><div><h3>Assuntos</h3><p>Escolha um ou mais conteúdos para estudar.</p></div><span class="selected-count" id="selectedCount">0 selecionados</span></header>
              <div class="search-field"><svg class="icon"><use href="#i-search"></use></svg><input id="topicSearch" type="search" placeholder="Buscar entre 26 assuntos..." aria-label="Buscar assunto" /></div>
              <div id="topicList" class="topic-list" aria-label="Seleção de conteúdos"></div>
              <div class="form-row form-row--exam"><label class="form-label">Número de questões<input id="examQuantity" type="number" name="numero_questoes" min="1" max="100" value="20" required /></label><label class="form-label">Tempo limite (minutos)<input id="examTime" type="number" name="tempo_limite" min="1" max="300" value="60" required /></label></div>
              <footer class="exam-footer"><p id="examSummary"><strong>0 assuntos</strong> • 20 questões • 60 minutos</p><button type="submit" class="button button--primary">Criar simulado <svg class="icon"><use href="#i-chevron"></use></svg></button></footer>
              <div id="examMessage" class="inline-message" role="status" aria-live="polite" hidden></div>
            </form>
          </section>
          <section id="meus_simulados_aba" class="content-panel empty-panel" aria-label="Meus simulados" hidden><span class="empty-panel__icon"><svg class="icon"><use href="#i-list"></use></svg></span><h2>Seus simulados ficarão aqui</h2><p>Quando conectarmos o MySQL, esta aba mostrará os simulados vinculados à sua conta.</p><button type="button" class="button button--outline" id="primeiro_simulado" data-sim-tab="criar">Criar meu primeiro simulado</button></section>
        </section>
        <section class="app-page" id="tela_problemas" data-screen="problemas" aria-labelledby="problemsHeading">
  <header class="page-heading">
    <div>
      <span class="eyebrow">APRENDER É COLOCAR EM PRÁTICA</span>
      <h1 id="problemsHeading">Problemas</h1>
      <p>Selecione um conteúdo e pratique com questões de matemática.</p>
    </div>
    <span class="page-heading__icon" aria-hidden="true">
      <svg class="icon"><use href="#i-book"></use></svg>
    </span>
  </header>

  <div id="painel_conteudos">
    <aside class="tracks-intro">
      <span class="tracks-intro__icon" aria-hidden="true">
        <svg class="icon"><use href="#i-cap"></use></svg>
      </span>
      <div>
        <strong>Escolha seu próximo desafio</strong>
        <p>Explore os assuntos disponíveis e resolva questões do básico ao avançado.</p>
      </div>
      <span id="problemTotal" class="pill">26 conteúdos</span>
    </aside>
        <header class="tracks-bar">
        <h2>Todos os conteúdos <span id="problemCount">26 encontrados</span></h2>
        <div class="search-field search-field--tracks">
        <svg class="icon" aria-hidden="true"><use href="#i-search"></use></svg>
        <input id="problemSearch" type="search" placeholder="Buscar conteúdo..."
               aria-label="Buscar conteúdo para resolver problemas">
        </div>
        </header>

        <section id="aba_problemas" class="tracks-grid" aria-label="Conteúdos disponíveis"></section>
        <div id="problemMessage" class="inline-message" role="status" hidden></div>
        </div>

        <section id="painel_questoes" hidden>
        <button id="voltar_conteudos" type="button" class="button button--outline">
        ← Voltar aos conteúdos
        </button>
        <h2 id="titulo_conteudo"></h2>
        <div id="lista_questoes" class="lista-questoes"></div>
        <article id="questao_aberta" class="content-panel" hidden>
        <button id="voltar_questoes" type="button" class="button button--outline">
          Voltar às questões
        </button>
        <h3 id="titulo_questao_aberta" style="margin: 20px 0 12px;">﻿</h3>
        <p id="enunciado_questao_aberta" style="margin: 0 0 20px; line-height: 1.6;"></p>
        <div id="alternativas_questao" class="lista-questoes"></div>
        </article>
        </section>
        </section>

        <section class="app-page" id="tela_perfil" data-screen="perfil" aria-labelledby="profileHeading">
          <header class="page-heading"><div><span class="eyebrow">SUAS INFORMAÇÕES</span><h1 id="profileHeading">Meu perfil</h1><p>Consulte os dados da sua conta na DAMA.</p></div><span class="page-heading__icon"><svg class="icon"><use href="#i-user"></use></svg></span></header>

          <div class="profile-layout">
            <article class="content-panel profile-summary" aria-label="Resumo do perfil">
              <span id="profileAvatar" class="profile-summary__avatar" aria-hidden="true"><?php print($inicial) ?></span>
              <h2 id="profileName"><?php print($primeiro_nome) ?></h2>
              <p id="profileEmail"><?php print($aluno['email']) ?></p>
              <span id="profileRoleBadge" class="pill pill--orange"><?php print(ucfirst($_SESSION['tipo_conta'])) ?></span>
            </article>

            <article class="content-panel profile-details" aria-labelledby="profileDetailsHeading">
              <header class="profile-details__heading"><h2 id="profileDetailsHeading">Dados pessoais</h2><p>Informações disponíveis no seu cadastro.</p><button type="button" id="excluir_conta"class="profile-action profile-action--delete" title="Excluir conta" aria-label="Excluir conta"><svg class="icon" aria-hidden="true"><use href="#i-trash"></use></svg></button></header>
              <dl class="profile-fields">
                <div class="profile-field profile-field--editable"><dt>Nome completo</dt><dd id="profileFullName"><?php print($aluno['nome']) ?></dd><button type="button" id="editar_nome" class="profile-action profile-action--edit" title="Editar nome" aria-label="Editar nome"><svg class="icon" aria-hidden="true"><use href="#i-pencil"></use></svg></button></div>
                <div class="profile-field"><dt>E-mail</dt><dd id="profileEmailDetail"><?php print($aluno['email']) ?></dd></div>
                <div class="profile-field profile-field--editable"><dt>Data de nascimento</dt><dd id="profileBirth"><?php print($aluno['nascimento']) ?></dd><button type="button" id="editar_nascimento" class="profile-action profile-action--edit" title="Editar nascimento" aria-label="Editar nascimento"> <svg class="icon" aria-hidden="true"><use href="#i-pencil"></use></svg></button></div>
                <div class="profile-field"><dt>Tipo de conta</dt><dd id="profileRole"><?php print(ucfirst($_SESSION['tipo_conta'])) ?></dd></div>
              </dl>
            </article>
          </div>
        </section>
      </main>
      <footer class="app-footer">© 2026 DAMA <span>Feito para quem aprende. Feito para quem ensina.</span></footer>
    </div>
    <?php endif; ?>
  </body>
</html>
