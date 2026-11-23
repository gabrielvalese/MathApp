<?php
$titulo = 'Entrar';
$shell = 'none';
$ativo = '';
require __DIR__ . '/../../includes/topo.php';
?>
  <div class="auth">
    <aside class="auth__aside">
      <a class="brand" href="<?= url('index.php') ?>"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#ff5a1f"/><path d="M7 17l5 5 6-13h8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Mathema</span></a>
      <div>
        <h2>Bem-vindo <span>de volta.</span></h2>
        <p>Sua trilha continua de onde você parou.</p>
      </div>
      <small>Área do aluno</small>
    </aside>

    <main class="auth__main" data-steps>
      <section class="auth__card" data-step="1">
        <div class="seg" aria-label="Acesso"><a href="cadastro-aluno.php">Criar conta</a><a href="login-aluno.php" aria-current="page">Entrar</a></div>
        <h1>Entrar na sua conta</h1>
        <p>Informe seu e-mail. Enviaremos um código de acesso.</p>
        <button type="button" class="btn btn--block google" data-act="login-google"><b aria-hidden="true">G</b> Entrar com Google</button>
        <div class="divider">ou com e-mail</div>
        <form class="form" data-form="login-aluno-email" data-next-step="2" novalidate>
          <div class="field"><label for="email">E-mail</label><input class="input" id="email" name="email" type="email" autocomplete="email" required placeholder="voce@exemplo.com"></div>
          <button class="btn btn--primary btn--block" type="submit">Enviar código por e-mail</button>
        </form>
        <p class="auth__alt">É professor? <a class="link" href="login-professor.php">Entre aqui</a></p>
      </section>

      <section class="auth__card" data-step="2" hidden>
        <h1>Digite o código</h1>
        <p>Enviamos 6 dígitos para <strong data-email>seu e-mail</strong>.</p>
        <form class="form" data-form="login-aluno-otp">
          <div class="otp" role="group" aria-label="Código de verificação">
            <input inputmode="numeric" maxlength="1" aria-label="Dígito 1" autocomplete="one-time-code"><input inputmode="numeric" maxlength="1" aria-label="Dígito 2"><input inputmode="numeric" maxlength="1" aria-label="Dígito 3"><input inputmode="numeric" maxlength="1" aria-label="Dígito 4"><input inputmode="numeric" maxlength="1" aria-label="Dígito 5"><input inputmode="numeric" maxlength="1" aria-label="Dígito 6">
          </div>
          <button class="btn btn--primary btn--block" type="submit" data-otp-submit>Entrar</button>
        </form>
        <p class="auth__alt"><button type="button" class="btn btn--quiet btn--sm" data-act="reenviar-codigo">Reenviar código</button> · <button type="button" class="btn btn--quiet btn--sm" data-goto="1">Trocar e-mail</button></p>
      </section>
    </main>
  </div>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
