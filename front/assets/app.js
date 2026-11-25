/* ==========================================================
   LOGIN / CADASTRO
   ========================================================== */
if (document.getElementById("authView")) {
  let tela = "entrar";
  let perfil = "aluno";

  function trocar_tela(opcao) {
    document.getElementById(tela === "entrar" ? "formulario_login" : "formulario_registro").hidden = true;

    if (opcao === "aluno" || opcao === "professor") {
      perfil = opcao;
      const tipo_conta = document.getElementById(perfil).dataset.role;
      document.getElementById("perfil_login").value = tipo_conta;
      document.getElementById("perfil_registro").value = tipo_conta;
    } else {
      tela = opcao;
    }

    document.getElementById(tela === "entrar" ? "formulario_login" : "formulario_registro").hidden = false;

    botao_entrar.classList.toggle("is-active", tela === "entrar");
    botao_criar.classList.toggle("is-active", tela === "criar");
    botao_aluno.classList.toggle("is-selected", perfil === "aluno");
    botao_professor.classList.toggle("is-selected", perfil === "professor");
  }

  const botao_entrar = document.getElementById("entrar_conta");
  const botao_criar = document.getElementById("criar_conta");
  const botao_aluno = document.getElementById("aluno");
  const botao_professor = document.getElementById("professor");

  botao_entrar.addEventListener("click", () => trocar_tela("entrar"));
  botao_criar.addEventListener("click", () => trocar_tela("criar"));
  botao_aluno.addEventListener("click", () => trocar_tela("aluno"));
  botao_professor.addEventListener("click", () => trocar_tela("professor"));

  const formulario = document.getElementById("formulario_registro");

  async function criar_conta(evento) {
    evento.preventDefault();

    const senha = document.getElementById("senha").value;
    const confirma_senha = document.getElementById("confirma_senha").value;
    const texto_senha_incorreta = document.getElementById("erro_senha");
    const sucesso = document.getElementById("cadastro_sucesso");

    if (senha !== confirma_senha) {
      texto_senha_incorreta.innerHTML = "<strong>Atenção:</strong> as senhas não coincidem.";
      return;
    } else {
      texto_senha_incorreta.textContent = "";
    }

    const botao = document.getElementById("botao_criar_conta");
    botao.disabled = true;

    try {
      const resposta = await fetch(formulario.action, { method: "POST", body: new FormData(formulario) });
      const dados = await resposta.json();
      if (!resposta.ok || dados.sucesso !== true) throw new Error("Cadastro não confirmado");
      formulario.reset();
      sucesso.textContent = "Cadastro realizado com sucesso!";
    } catch {
      texto_senha_incorreta.textContent = "Não foi possível cadastrar. Tente novamente.";
    } finally {
      botao.disabled = false;
    }
  }

  formulario.addEventListener("submit", criar_conta);

  function mostrar_senha() {
    const senha = document.getElementById("senha_login");
    senha.type = senha.type === "password" ? "text" : "password";
  }
  document.getElementById("mostrar_senha").addEventListener("click", mostrar_senha);

  const formulario_login = document.getElementById("formulario_login");

  async function login(evento) {
    evento.preventDefault();
    const aviso = document.getElementById("erro_login");
    aviso.textContent = "";

    try {
      const resposta = await fetch(formulario_login.action, { method: "POST", body: new FormData(formulario_login) });
      if (resposta.status === 401) { aviso.textContent = "E-mail ou senha incorretos."; return; }
      const dados = await resposta.json();
      if (!resposta.ok || dados.sucesso !== true) throw new Error("Login não confirmado");
      window.location.reload();
    } catch {
      aviso.textContent = "Não foi possível entrar. Tente novamente.";
    }
  }

  formulario_login?.addEventListener("submit", login);
}

/* ==========================================================
   APP LOGADO
   ========================================================== */
if (document.getElementById("appView")) {
  let telaAtual = "inicio";

  function trocar_tela_app(proximaTela) {
    document.getElementById("tela_" + telaAtual).classList.remove("is-active");
    document.getElementById("botao_" + telaAtual).classList.remove("is-active");

    telaAtual = proximaTela;

    if (telaAtual === "problemas") {
      painelQuestoes.hidden = true;
      painelConteudos.hidden = false;
      carregar_conteudos();
    }

    // NOVO: ao abrir Simulados, carrega conteúdos e histórico
    if (telaAtual === "simulados") {
      carregar_topicos_simulado();
      listar_simulados();
    }

    document.getElementById("tela_" + telaAtual).classList.add("is-active");
    document.getElementById("botao_" + telaAtual).classList.add("is-active");
  }

  document.getElementById("botao_inicio").addEventListener("click", () => trocar_tela_app("inicio"));
  document.getElementById("botao_simulados").addEventListener("click", () => trocar_tela_app("simulados"));
  document.getElementById("botao_problemas").addEventListener("click", () => trocar_tela_app("problemas"));
  document.getElementById("botao_perfil").addEventListener("click", () => trocar_tela_app("perfil"));
  document.getElementById("botao_inicio_simulados").addEventListener("click", () => trocar_tela_app("simulados"));
  document.getElementById("botao_inicio_problemas").addEventListener("click", () => trocar_tela_app("problemas"));

  const painelConteudos = document.getElementById("painel_conteudos");
  const painelQuestoes = document.getElementById("painel_questoes");

  document.getElementById("voltar_conteudos").addEventListener("click", function () {
    painelQuestoes.hidden = true;
    painelConteudos.hidden = false;
  });

  const questaoAberta = document.getElementById("questao_aberta");
  const areaAlternativas = document.getElementById("alternativas_questao");

  document.getElementById("voltar_questoes").addEventListener("click", function () {
    questaoAberta.hidden = true;
    document.getElementById("lista_questoes").hidden = false;
  });

  /* -------------------- ABAS DE SIMULADOS -------------------- */
  const botaoCriar = document.getElementById("criar_simulados");
  const botaoMeus = document.getElementById("meus_simulados");
  const painelCriar = document.getElementById("criar_simulados_aba");
  const painelMeus = document.getElementById("meus_simulados_aba");

  let painelAtual = painelCriar;
  let botaoAtual = botaoCriar;

  function trocar_aba_simulado(proximoPainel, proximoBotao) {
    painelAtual.hidden = true;
    botaoAtual.classList.remove("is-active");
    painelAtual = proximoPainel;
    botaoAtual = proximoBotao;
    painelAtual.hidden = false;
    botaoAtual.classList.add("is-active");

    if (proximoPainel === painelMeus) listar_simulados();
  }

  botaoCriar.addEventListener("click", () => trocar_aba_simulado(painelCriar, botaoCriar));
  botaoMeus.addEventListener("click", () => trocar_aba_simulado(painelMeus, botaoMeus));

  /* -------------------- PROBLEMAS: CONTEÚDOS -------------------- */
  async function carregar_conteudos() {
    const aba = document.getElementById("aba_problemas");
    aba.textContent = "Carregando conteúdos…";

    try {
      const resposta = await fetch("../back/buscar_conteudos.php");
      if (!resposta.ok) throw new Error("Erro ao buscar conteúdos");

      const conteudos = await resposta.json();
      aba.textContent = "";

      if (conteudos.length === 0) { aba.textContent = "Nenhum conteúdo encontrado."; return; }

      for (const conteudo of conteudos) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "track-card";
        const nome = conteudo.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let icone = "#i-book";
        if (nome.includes("geometria espacial")) icone = "#i-cube";
        else if (nome.includes("geometria analitica")) icone = "#i-axis";
        else if (nome.includes("geometria") || nome.includes("trigonometria")) icone = "#i-triangle";
        else if (nome.includes("probabilidade")) icone = "#i-dice";
        else if (nome.includes("combinatoria")) icone = "#i-network";
        else if (nome.includes("estatistica")) icone = "#i-chart";
        else if (nome.includes("porcentagem") || nome.includes("juros")) icone = "#i-percent";
        else if (nome.includes("logaritm")) icone = "#i-log";
        else if (nome.includes("exponencial")) icone = "#i-curve";
        else if (nome.includes("quadratica") || nome.includes("segundo grau") || nome.includes("2º grau")) icone = "#i-parabola";
        else if (nome.includes("funcao afim") || nome.includes("primeiro grau") || nome.includes("1º grau")) icone = "#i-line-chart";
        else if (nome.includes("func")) icone = "#i-function";
        else if (nome.includes("conjuntos")) icone = "#i-venn";
        else if (nome.includes("elipse") || nome.includes("conicas")) icone = "#i-ellipse";
        else if (nome.includes("modulo") || nome.includes("valor absoluto")) icone = "#i-absolute";
        else if (nome.includes("progress") || nome.includes("sequencia")) icone = "#i-sequence";
        else if (nome.includes("somatorio")) icone = "#i-sigma";
        else if (nome.includes("limite")) icone = "#i-infinity";
        else if (nome.includes("matriz") || nome.includes("matrizes") || nome.includes("determinante")) icone = "#i-grid";
        else if (nome.includes("equac") || nome.includes("inequac") || nome.includes("sistema")) icone = "#i-calculator";

        botao.innerHTML = `
          <span class="track-card__icon" aria-hidden="true">
            <svg class="icon"><use href="${icone}"></use></svg>
          </span>
          <strong></strong>
          <svg class="icon" aria-hidden="true"><use href="#i-chevron"></use></svg>
        `;
        botao.querySelector("strong").textContent = conteudo.nome;
        botao.addEventListener("click", () => carregar_questoes(conteudo.id, conteudo.nome));
        aba.appendChild(botao);
      }
    } catch {
      aba.textContent = "Não foi possível carregar os conteúdos.";
    }
  }

  /* -------------------- PROBLEMAS: QUESTÕES -------------------- */
  async function carregar_questoes(id_conteudo, nome_conteudo) {
    const lista = document.getElementById("lista_questoes");
    questaoAberta.hidden = true;
    lista.hidden = false;
    painelConteudos.hidden = true;
    painelQuestoes.hidden = false;
    document.getElementById("titulo_conteudo").textContent = nome_conteudo;
    lista.textContent = "Carregando questões…";

    const dados = new FormData();
    dados.append("conteudo_id", id_conteudo);

    try {
      const resposta = await fetch("../back/buscar_questoes.php", { method: "POST", body: dados });
      if (!resposta.ok) throw new Error("Erro ao buscar questões");
      const questoes = await resposta.json();
      lista.textContent = "";

      if (questoes.length === 0) {
        lista.textContent = "Nenhuma questão encontrada para este conteúdo.";
        return;
      }

      for (const questao of questoes) {
        const linhas = questao.enunciado.split("\n");
        const titulo = linhas[0];
        const enunciado = linhas.slice(1).join("\n").trim();

        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "track-card";
        botao.textContent = titulo;

        botao.addEventListener("click", () => abrir_questao_geral(questao));
        lista.appendChild(botao);
      }
    } catch {
      lista.textContent = "Não foi possível carregar as questões.";
    }
  }

  /* --- Abre a questão e injeta botão Responder + feedback --- */
  function abrir_questao_geral(questao) {
    const linhas = questao.enunciado.split("\n");
    const titulo = linhas[0];
    const enunciado = linhas.slice(1).join("\n").trim();

    document.getElementById("titulo_questao_aberta").textContent = enunciado ? titulo : "Questão " + questao.id;
    document.getElementById("enunciado_questao_aberta").textContent = enunciado || titulo;

    areaAlternativas.textContent = "";
    const pai = areaAlternativas.parentElement;
    pai.querySelectorAll(".questao-responder-button, .questao-feedback").forEach(el => el.remove());

    for (const alternativa of questao.alternativas) {
      const opcao = document.createElement("label");
      opcao.className = "track-card";

      const escolha = document.createElement("input");
      escolha.type = "radio";
      escolha.name = "alternativa";
      escolha.value = alternativa.id;

      const texto = document.createElement("span");
      texto.textContent = alternativa.letra + ") " + alternativa.texto;

      opcao.append(escolha, texto);
      areaAlternativas.appendChild(opcao);
    }

    const btnResponder = document.createElement("button");
    btnResponder.type = "button";
    btnResponder.className = "button button--primary button--full questao-responder-button";
    btnResponder.textContent = "Responder";
    btnResponder.addEventListener("click", () => responder_questao_geral(questao.id));

    const feedback = document.createElement("div");
    feedback.id = "feedback_questao";
    feedback.className = "questao-feedback";
    feedback.hidden = true;

    areaAlternativas.after(btnResponder, feedback);

    document.getElementById("lista_questoes").hidden = true;
    questaoAberta.hidden = false;
  }

  /* --- Envia resposta avulsa --- */
  async function responder_questao_geral(id_questao) {
    const selecionada = document.querySelector('input[name="alternativa"]:checked');
    if (!selecionada) { alert("Selecione uma alternativa antes de responder."); return; }

    const dados = new FormData();
    dados.append("id_questao", id_questao);
    dados.append("id_alternativa", selecionada.value);

    const feedback = document.getElementById("feedback_questao");
    feedback.hidden = true;

    try {
      const resp = await fetch("../back/responder_questao.php", { method: "POST", body: dados });
      const res = await resp.json();
      if (!resp.ok || !res.sucesso) throw new Error();

      feedback.hidden = false;
      if (res.acertou) {
        feedback.className = "questao-feedback is-correct";
        feedback.innerHTML = "<strong>✓ Resposta correta!</strong>";
      } else {
        feedback.className = "questao-feedback is-wrong";
        feedback.innerHTML = `<strong>✗ Resposta incorreta.</strong> A correta era <strong>${res.resposta_correta.letra}) ${res.resposta_correta.texto}</strong>.`;
      }
    } catch {
      alert("Não foi possível enviar a resposta.");
    }
  }

  /* ==========================================================
     SIMULADOS
     ========================================================== */
  const topicosSimulado = document.getElementById("topicos_simulado");
  const formSimulado = document.getElementById("form_simulado");
  const contadorConteudos = document.getElementById("contador_conteudos");
  const resumoSimulado = document.getElementById("simulado_resumo");
  const buscaSimulado = document.getElementById("simulado_busca");
  const selecionadosConteudos = new Set();
  const todosConteudosSimulado = []; // cache para busca

  let simuladoAtual = null;
  let timerInterval = null;

  function atualizar_resumo_simulado() {
    const qtd = document.getElementById("simulado_numero").value;
    const tmp = document.getElementById("simulado_tempo").value;
    resumoSimulado.innerHTML = `<strong>${selecionadosConteudos.size} assunto(s)</strong> • ${qtd} questões • ${tmp} minutos`;
  }

  async function carregar_topicos_simulado() {
    if (!topicosSimulado || topicosSimulado.dataset.carregado === "1") return;

    try {
      const resposta = await fetch("../back/buscar_conteudos.php");
      if (!resposta.ok) throw new Error();
      const conteudos = await resposta.json();

      todosConteudosSimulado.length = 0;
      todosConteudosSimulado.push(...conteudos);

      render_topicos_simulado(conteudos);
      topicosSimulado.dataset.carregado = "1";
    } catch {
      topicosSimulado.textContent = "Não foi possível carregar os conteúdos.";
    }
  }

  function render_topicos_simulado(conteudos) {
    topicosSimulado.textContent = "";
    for (const c of conteudos) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "topic-button" + (selecionadosConteudos.has(c.id) ? " is-selected" : "");
      btn.dataset.id = c.id;
      btn.innerHTML = `<span>${c.nome}</span><svg class="icon" aria-hidden="true"><use href="#i-check"></use></svg>`;
      btn.addEventListener("click", () => {
        if (selecionadosConteudos.has(c.id)) {
          selecionadosConteudos.delete(c.id);
          btn.classList.remove("is-selected");
        } else {
          selecionadosConteudos.add(c.id);
          btn.classList.add("is-selected");
        }
        contadorConteudos.textContent = `${selecionadosConteudos.size} selecionado(s)`;
        atualizar_resumo_simulado();
      });
      topicosSimulado.appendChild(btn);
    }
  }

  buscaSimulado?.addEventListener("input", () => {
    const termo = buscaSimulado.value.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const filtrados = todosConteudosSimulado.filter(c =>
      c.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termo)
    );
    render_topicos_simulado(filtrados);
  });

  document.getElementById("simulado_numero")?.addEventListener("input", atualizar_resumo_simulado);
  document.getElementById("simulado_tempo")?.addEventListener("input", atualizar_resumo_simulado);

  formSimulado?.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const erro = document.getElementById("erro_simulado");
    erro.hidden = true;
    erro.textContent = "";

    if (selecionadosConteudos.size === 0) {
      erro.hidden = false;
      erro.textContent = "Selecione pelo menos um conteúdo.";
      return;
    }

    const dados = new FormData();
    for (const id of selecionadosConteudos) dados.append("conteudos[]", id);
    dados.append("numero_questoes", document.getElementById("simulado_numero").value);
    dados.append("tempo_limite", document.getElementById("simulado_tempo").value);

    const botao = document.getElementById("gerar_simulado");
    botao.disabled = true;

    try {
      const resp = await fetch("../back/criar_simulado.php", { method: "POST", body: dados });
      const res = await resp.json();

      if (!resp.ok || !res.sucesso) {
        erro.hidden = false;
        erro.textContent = res.erro || "Não foi possível criar o simulado.";
        return;
      }

      abrir_simulado(res.id_simulado);
    } catch {
      erro.hidden = false;
      erro.textContent = "Não foi possível criar o simulado.";
    } finally {
      botao.disabled = false;
    }
  });

  async function abrir_simulado(id) {
    try {
      const dados = new FormData();
      dados.append("id_simulado", id);
      const resp = await fetch("../back/buscar_simulado.php", { method: "POST", body: dados });
      const res = await resp.json();
      if (!resp.ok || !res.sucesso) throw new Error();
      simuladoAtual = res;
      render_simulado(res);
    } catch {
      alert("Não foi possível abrir o simulado.");
    }
  }

  function render_simulado(simulado) {
    const overlay = document.getElementById("simulado_overlay");
    const container = document.getElementById("simulado_questoes");
    const titulo = document.getElementById("simulado_titulo");
    const timerEl = document.getElementById("simulado_timer");
    const btnFin = document.getElementById("simulado_finalizar");

    overlay.hidden = false;
    titulo.textContent = `Simulado #${simulado.id} — ${simulado.numero_questoes} questões`;
    container.textContent = "";

    if (simulado.status === "concluido" || simulado.status === "expirado") {
      timerEl.textContent = simulado.status === "concluido" ? "Concluído" : "Expirado";
      timerEl.classList.remove("is-warning");
      btnFin.textContent = "Fechar";
      btnFin.onclick = () => { overlay.hidden = true; listar_simulados(); };

      container.innerHTML = `
        <div class="content-panel" style="text-align:center; padding:40px;">
          <h2>${simulado.status === "concluido" ? "Simulado finalizado" : "Tempo esgotado"}</h2>
          <p style="margin-top:12px; font-size:1.1rem;">Pontuação: <strong>${simulado.pontuacao}/${simulado.numero_questoes}</strong></p>
        </div>`;
      return;
    }

    btnFin.textContent = "Finalizar simulado";
    btnFin.onclick = () => finalizar_simulado(false);

    simulado.questoes.forEach((q, idx) => {
      const bloco = document.createElement("article");
      bloco.className = "content-panel simulado-questao";

      const linhas = q.enunciado.split("\n");
      const tituloQ = linhas[0];
      const corpo = linhas.slice(1).join("\n").trim() || tituloQ;

      bloco.innerHTML = `
        <h3 class="simulado-questao__titulo">${idx + 1}. ${tituloQ}</h3>
        <p class="simulado-questao__enunciado">${corpo}</p>
      `;

      const alts = document.createElement("div");
      alts.className = "simulado-alternativas";

      q.alternativas.forEach(a => {
        const label = document.createElement("label");
        label.className = "track-card";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `simulado_q_${q.id}`;
        radio.value = a.id;
        if (q.resposta_escolhida === a.id) radio.checked = true;

        radio.addEventListener("change", () => responder_simulado(q.id, a.id));

        const span = document.createElement("span");
        span.textContent = `${a.letra}) ${a.texto}`;

        label.append(radio, span);
        alts.appendChild(label);
      });

      bloco.appendChild(alts);
      container.appendChild(bloco);
    });

    iniciar_timer(simulado.segundos_restantes);
  }

  async function responder_simulado(id_questao, id_alternativa) {
    const dados = new FormData();
    dados.append("id_questao", id_questao);
    dados.append("id_alternativa", id_alternativa);
    dados.append("id_simulado", simuladoAtual.id);

    try {
      const resp = await fetch("../back/responder_questao.php", { method: "POST", body: dados });
      const res = await resp.json();
      if (res.expirado) {
        clearInterval(timerInterval);
        document.getElementById("simulado_timer").textContent = "00:00";
        finalizar_simulado(true);
      }
    } catch { /* silencioso */ }
  }

  function iniciar_timer(segundos) {
    const el = document.getElementById("simulado_timer");
    let restante = segundos;
    clearInterval(timerInterval);

    const tick = () => {
      if (restante <= 0) {
        clearInterval(timerInterval);
        el.textContent = "00:00";
        el.classList.add("is-warning");
        finalizar_simulado(true);
        return;
      }
      const m = Math.floor(restante / 60);
      const s = restante % 60;
      el.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      el.classList.toggle("is-warning", restante <= 60);
      restante--;
    };

    tick();
    timerInterval = setInterval(tick, 1000);
  }

  async function finalizar_simulado(automatico = false) {
    if (!simuladoAtual) return;
    if (!automatico && !confirm("Deseja finalizar o simulado agora?")) return;

    clearInterval(timerInterval);

    const dados = new FormData();
    dados.append("id_simulado", simuladoAtual.id);

    try {
      const resp = await fetch("../back/finalizar_simulado.php", { method: "POST", body: dados });
      const res = await resp.json();
      if (!resp.ok || !res.sucesso) throw new Error();

      document.getElementById("simulado_overlay").hidden = true;
      simuladoAtual = null;
      listar_simulados();

      alert((automatico ? "Tempo esgotado! " : "") +
        `Simulado finalizado.\nAcertos: ${res.acertos}/${res.total} (${res.percentual}%)`);
    } catch {
      alert("Não foi possível finalizar o simulado.");
    }
  }

  async function listar_simulados() {
    const painel = document.getElementById("lista_meus_simulados");
    if (!painel) return;
    painel.innerHTML = `<p class="muted-text">Carregando simulados…</p>`;

    try {
      const resp = await fetch("../back/listar_simulados.php");
      const simulados = await resp.json();

      if (!Array.isArray(simulados) || simulados.length === 0) {
        painel.innerHTML = `<div class="empty-panel" style="min-height:220px;">
          <span class="empty-panel__icon"><svg class="icon"><use href="#i-list"></use></svg></span>
          <h2>Nenhum simulado ainda</h2>
          <p>Quando você criar seu primeiro simulado, ele aparecerá aqui.</p>
        </div>`;
        return;
      }

      painel.textContent = "";
      const rotulos = {
        criado:       { txt: "Não iniciado", cls: "" },
        em_andamento: { txt: "Em andamento", cls: "pill--orange" },
        concluido:    { txt: "Concluído",    cls: "" },
        expirado:     { txt: "Expirado",     cls: "pill--orange" },
      };

      for (const s of simulados) {
        const card = document.createElement("div");
        card.className = "simulado-historico-item";

        const rotulo = rotulos[s.status] || { txt: s.status, cls: "" };
        const dataStr = s.data_criacao ? new Date(s.data_criacao.replace(" ", "T")).toLocaleString("pt-BR") : "";

        card.innerHTML = `
          <div class="simulado-historico-info">
            <strong>Simulado #${s.id}</strong>
            <span>${s.numero_questoes} questões · ${s.tempo_limite} min</span>
            <span class="muted-text">${dataStr}</span>
          </div>
          <div class="simulado-historico-actions">
            <span class="pill ${rotulo.cls}">${rotulo.txt}</span>
            ${s.status === "concluido" ? `<span class="pill">${s.pontuacao}/${s.numero_questoes} acertos</span>` : ""}
          </div>
        `;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "button button--outline";
        btn.textContent = s.status === "concluido" ? "Ver resultado" : "Continuar";
        btn.addEventListener("click", () => abrir_simulado(s.id));

        card.appendChild(btn);
        painel.appendChild(card);
      }
    } catch {
      painel.innerHTML = `<p class="muted-text">Não foi possível carregar os simulados.</p>`;
    }
  }

  /* ==========================================================
     PERFIL
     ========================================================== */
  function excluir_conta() {
    const lixeira = document.getElementById("excluir_conta");
    lixeira.addEventListener("click", async function () {
      if (!confirm("Tem certeza de que quer excluir sua conta?")) return;
      lixeira.disabled = true;
      try {
        const resposta = await fetch("../back/excluir_conta.php", { method: "POST" });
        const dados = await resposta.json();
        if (resposta.ok && dados.sucesso === true) window.location.reload();
        else alert("Não foi possível excluir a conta.");
      } catch {
        alert("Não foi possível excluir a conta.");
      } finally {
        lixeira.disabled = false;
      }
    });
  }
  if (document.getElementById("excluir_conta")) excluir_conta();

  function atualizar_campo(idBotao, idTexto, campo, tipo) {
    const lapis = document.getElementById(idBotao);
    const texto = document.getElementById(idTexto);

    lapis.addEventListener("click", function () {
      const editor = document.createElement("form");
      const input = document.createElement("input");
      const salvar = document.createElement("button");

      input.type = tipo;
      input.value = texto.textContent.trim();
      input.className = "profile-edit-input";
      input.required = true;
      input.setAttribute("aria-label", lapis.getAttribute("aria-label"));

      salvar.type = "submit";
      salvar.textContent = "Salvar";
      salvar.className = "button button--outline";

      editor.append(input, salvar);
      texto.after(editor);
      texto.hidden = true;
      lapis.hidden = true;
      input.focus();

      editor.addEventListener("submit", async function (evento) {
        evento.preventDefault();
        const valor = input.value.trim();
        const dados = new FormData();
        dados.append("campo", campo);
        dados.append("valor", valor);
        salvar.disabled = true;

        try {
          const resposta = await fetch("../back/atualizar_perfil.php", { method: "POST", body: dados });
          const resultado = await resposta.json();
          if (!resposta.ok || resultado.sucesso !== true) throw new Error("Atualização não confirmada");
          texto.textContent = valor;
          texto.hidden = false;
          lapis.hidden = false;
          editor.remove();
          lapis.focus();
        } catch {
          alert("Não foi possível salvar. Tente novamente.");
          salvar.disabled = false;
        }
      });
    });
  }

  atualizar_campo("editar_nome", "profileFullName", "nome", "text");
  atualizar_campo("editar_nascimento", "profileBirth", "nascimento", "date");
}