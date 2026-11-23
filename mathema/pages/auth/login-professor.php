<?php
$titulo = 'Entrar como professor';
$shell = 'none';
$ativo = '';
require __DIR__ . '/../../includes/topo.php';
?>
  <div class="auth">
    <aside class="auth__aside">
      <a class="brand" href="<?= url('index.php') ?>"><svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#ff5a1f"/><path d="M7 17l5 5 6-13h8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Mathema</span></a>
      <div>
        <h2>Ensine com clareza. <span>Acompanhe de perto.</span></h2>
        <p>Suas salas e seus alunos, no mesmo lugar.</p>
      </div>
      <small>Área do professor</small>
    </aside>

    <main class="auth__main" data-steps>
      <section class="auth__card" data-step="1">
        <div class="seg" aria-label="Acesso"><a href="cadastro-professor.php">Solicitar acesso</a><a href="login-professor.php" aria-current="page">Entrar</a></div>
        <h1>Entrar como professor</h1>
        <p>Depois da senha, confirmamos seu acesso com um código enviado ao e-mail.</p>
        <form class="form" data-form="login-professor-senha" data-next-step="2" novalidate>
          <div class="field"><label for="email">E-mail institucional</label><input class="input" id="email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="senha">Senha</label><input class="input" id="senha" name="senha" type="password" autocomplete="current-password" required></div>
          <button class="btn btn--primary btn--block" type="submit">Continuar</button>
        </form>
        <p class="auth__alt">Ainda não tem acesso? <a class="link" href="cadastro-professor.php">Solicite aqui</a></p>
      </section>

      <section class="auth__card" data-step="2" hidden>
        <h1>Verifique seu e-mail</h1>
        <p>Enviamos um código de 6 dígitos para <strong data-email>seu e-mail</strong>.</p>
        <form class="form" data-form="login-professor-otp">
          <div class="otp" role="group" aria-label="Código de verificação">
            <input inputmode="numeric" maxlength="1" aria-label="Dígito 1" autocomplete="one-time-code"><input inputmode="numeric" maxlength="1" aria-label="Dígito 2"><input inputmode="numeric" maxlength="1" aria-label="Dígito 3"><input inputmode="numeric" maxlength="1" aria-label="Dígito 4"><input inputmode="numeric" maxlength="1" aria-label="Dígito 5"><input inputmode="numeric" maxlength="1" aria-label="Dígito 6">
          </div>
          <button class="btn btn--primary btn--block" type="submit" data-otp-submit>Entrar</button>
        </form>
        <p class="auth__alt"><button type="button" class="btn btn--quiet btn--sm" data-act="reenviar-codigo">Reenviar código</button> · <button type="button" class="btn btn--quiet btn--sm" data-goto="1">Voltar</button></p>
      </section>
    </main>
  </div>
<?php require __DIR__ . '/../../includes/rodape.php'; ?>
