<?php
$titulo = 'Acesso de professor';
$shell = 'none';
$ativo = '';
require __DIR__ . '/../../includes/topo.php';
?>
  <div class="auth">
    <aside class="auth__aside">
      <a class="brand" href="<?= url('index.php') ?>"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#ff5a1f"/><path d="M7 17l5 5 6-13h8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Mathema</span></a>
      <div>
        <h2>Ensine com clareza. <span>Acompanhe de perto.</span></h2>
        <p>Salas, banco de questões e relatórios de rascunhos por aluno.</p>
      </div>
      <small>Área do professor</small>
    </aside>

    <main class="auth__main" data-steps>
      <section class="auth__card" data-step="1">
        <div class="seg" aria-label="Acesso"><a href="cadastro-professor.php" aria-current="page">Solicitar acesso</a><a href="login-professor.php">Entrar</a></div>
        <h1>Acesso de professor</h1>
        <p>Validamos manualmente cada cadastro para manter as salas seguras.</p>

        <div class="notice">
          <strong>Como funciona</strong>
          <ol class="steps-guide" style="margin-top: 10px">
            <li>Informe seu e-mail institucional.</li>
            <li>Envie uma imagem do seu currículo que comprove a docência.</li>
            <li>Aguarde: nossa equipe confirma se você está ativo na instituição.</li>
          </ol>
        </div>

        <form class="form" data-form="cadastro-professor" data-next-step="2" novalidate>
          <div class="field"><label for="nome">Nome completo</label><input class="input" id="nome" name="nome" autocomplete="name" required></div>
          <div class="field"><label for="email">E-mail institucional</label><input class="input" id="email" name="email" type="email" required placeholder="nome@escola.edu.br"><span class="hint">Não aceitamos e-mails pessoais.</span></div>
          <div class="field"><label for="inst">Instituição de ensino</label><input class="input" id="inst" name="inst" required></div>
          <div class="field"><label for="senha">Senha</label><input class="input" id="senha" name="senha" type="password" minlength="8" autocomplete="new-password" required><span class="hint">Mínimo de 8 caracteres.</span></div>
          <div class="field">
            <span class="label-text" id="cv-l">Currículo (imagem)</span>
            <label class="dropzone" aria-labelledby="cv-l">
              <input type="file" name="curriculo" accept="image/*" required data-upload="#cv-prev">
              <strong>Escolha uma imagem</strong>
              <span class="small" data-file-name>PNG ou JPG, até 5 MB</span>
            </label>
            <div class="previews" id="cv-prev"></div>
          </div>
          <label class="check"><input type="checkbox" required> Declaro que as informações são verdadeiras e que estou ativo na instituição informada.</label>
          <button class="btn btn--primary btn--block" type="submit">Enviar para análise</button>
        </form>
        <p class="auth__alt">É aluno? <a class="link" href="cadastro-aluno.php">Crie sua conta</a></p>
      </section>

      <section class="auth__card" data-step="2" hidden>
        <h1>Pedido recebido</h1>
        <p>Você receberá a resposta em <strong data-email>seu e-mail institucional</strong>.</p>
        <ul class="status panel">
          <li class="is-done"><i></i><span><strong>Pedido enviado</strong><br><span class="small muted">E-mail e currículo recebidos.</span></span></li>
          <li class="is-now"><i></i><span><strong>Validação manual</strong><br><span class="small muted">A equipe confere se você é docente ativo.</span></span></li>
          <li><i></i><span><strong>Acesso liberado</strong><br><span class="small muted">Você poderá entrar com e-mail e senha.</span></span></li>
        </ul>
        <a class="btn btn--block" href="<?= url('index.php') ?>">Voltar ao início</a>
      </section>
    </main>
  </div>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
