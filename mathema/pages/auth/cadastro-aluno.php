<?php
$titulo = 'Criar conta';
$shell = 'none';
$ativo = '';
require __DIR__ . '/../../includes/topo.php';
?>
  <div class="auth">
    <aside class="auth__aside">
      <a class="brand" href="<?= url('index.php') ?>"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#ff5a1f"/><path d="M7 17l5 5 6-13h8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Mathema</span></a>
      <div>
        <h2>Matemática que <span>evolui com você.</span></h2>
        <p>Trilhas, simulados e competições para o Ensino Médio.</p>
      </div>
      <small>Área do aluno</small>
    </aside>

    <main class="auth__main" data-steps>
      <!-- Etapa 1: dados -->
      <section class="auth__card" data-step="1">
        <div class="seg" aria-label="Acesso"><a href="cadastro-aluno.php" aria-current="page">Criar conta</a><a href="login-aluno.php">Entrar</a></div>
        <h1>Crie sua conta</h1>
        <p>Use o Google ou digite seu e-mail. Enviaremos um código para confirmar.</p>
        <button type="button" class="btn btn--block google" data-act="cadastro-google"><b aria-hidden="true">G</b> Continuar com Google</button>
        <div class="divider">ou com e-mail</div>
        <form class="form" data-form="cadastro-aluno" data-next-step="2" novalidate>
          <div class="field"><label for="nome">Nome</label><input class="input" id="nome" name="nome" autocomplete="name" required></div>
          <div class="field"><label for="email">E-mail</label><input class="input" id="email" type="email" name="email" autocomplete="email" required placeholder="voce@exemplo.com"></div>
          <div class="field"><label for="serie">Série</label>
            <select class="select" id="serie" name="serie" required><option value="">Selecione</option><option>1º ano do Ensino Médio</option><option>2º ano do Ensino Médio</option><option>3º ano do Ensino Médio</option><option>Pré-vestibular ou concurso</option></select></div>
          <label class="check"><input type="checkbox" required> Li e aceito os termos de uso e a política de privacidade.</label>
          <button class="btn btn--primary btn--block" type="submit">Enviar código por e-mail</button>
        </form>
        <p class="auth__alt">É professor? <a class="link" href="cadastro-professor.php">Solicite acesso</a></p>
      </section>

      <!-- Etapa 2: verificação -->
      <section class="auth__card" data-step="2" hidden>
        <h1>Confirme seu e-mail</h1>
        <p>Digitamos um código de 6 dígitos para <strong data-email>seu e-mail</strong>.</p>
        <form class="form" data-form="cadastro-aluno-otp" data-next-step="3">
          <div class="otp" role="group" aria-label="Código de verificação">
            <input inputmode="numeric" maxlength="1" aria-label="Dígito 1" autocomplete="one-time-code"><input inputmode="numeric" maxlength="1" aria-label="Dígito 2"><input inputmode="numeric" maxlength="1" aria-label="Dígito 3"><input inputmode="numeric" maxlength="1" aria-label="Dígito 4"><input inputmode="numeric" maxlength="1" aria-label="Dígito 5"><input inputmode="numeric" maxlength="1" aria-label="Dígito 6">
          </div>
          <button class="btn btn--primary btn--block" type="submit" data-otp-submit>Confirmar cadastro</button>
        </form>
        <p class="auth__alt">Não chegou? <button type="button" class="btn btn--quiet btn--sm" data-act="reenviar-codigo">Reenviar código</button> · <button type="button" class="btn btn--quiet btn--sm" data-goto="1">Trocar e-mail</button></p>
      </section>

      <!-- Etapa 3: concluído -->
      <section class="auth__card" data-step="3" hidden>
        <span class="success-mark" aria-hidden="true">✓</span>
        <h1>Conta criada</h1>
        <p>Tudo pronto. Sua trilha de Matemática está esperando.</p>
        <a class="btn btn--primary btn--block" href="../aluno/dashboard.php">Ir para o início</a>
      </section>
    </main>
  </div>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
