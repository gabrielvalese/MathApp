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
    evento.preventDefault();
    texto_senha_incorreta.innerHTML = "<strong>Atenção:</strong> as senhas não coincidem.";
  } else {
    texto_senha_incorreta.textContent = "";
  }
  const botao = document.getElementById("botao_criar_conta");
  botao.disabled = true;

  try {
    const resposta = await fetch(formulario.action, {
      method: "POST",
      body: new FormData(formulario)
    });

    const dados = await resposta.json();

    if (!resposta.ok || dados.sucesso !== true) {
      throw new Error("Cadastro não confirmado");
    }
    formulario.reset();
    sucesso.textContent = "Cadastro realizado com sucesso!";
  } catch {
    erro.textContent = "Não foi possível cadastrar. Tente novamente.";
  } finally {
    botao.disabled = false;
  }
}


formulario.addEventListener("submit", criar_conta);


function mostrar_senha() {
  const senha = document.getElementById("senha_login");
  if(senha.type === "password") {
    senha.type = "text";  
  } else {
    senha.type = "password";
  }
  
}

  const botao_mostrar = document.getElementById("mostrar_senha");
  botao_mostrar.addEventListener("click", mostrar_senha);



const formulario_login = document.getElementById("formulario_login"); 

async function login (evento) {
  
  evento.preventDefault();

  const aviso = document.getElementById("erro_login");
  aviso.textContent = "";

  try {
    const resposta = await fetch(formulario_login.action, {
      method: "POST",
      body: new FormData(formulario_login)
    });

    if (resposta.status === 401) {
      aviso.textContent = "E-mail ou senha incorretos.";
      return;
    }

    const dados = await resposta.json();

    if (!resposta.ok || dados.sucesso !== true) {
      throw new Error("Login não confirmado");
    }
    window.location.reload();
  } catch {
    aviso.textContent = "Não foi possível entrar. Tente novamente.";
  }
} 

formulario_login?.addEventListener("submit", login); }





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
  const botaoCriar = document.getElementById("criar_simulados");
  const botaoMeus = document.getElementById("meus_simulados");
  const botaoMeuprimeiro = document.getElementById("primeiro_simulado");
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
}

botaoCriar.addEventListener("click", () => trocar_aba_simulado(painelCriar, botaoCriar));
botaoMeus.addEventListener("click", () => trocar_aba_simulado(painelMeus, botaoMeus));
botaoMeuprimeiro.addEventListener("click", () => trocar_aba_simulado(painelCriar, botaoCriar));



async function carregar_conteudos() {
  const aba = document.getElementById("aba_problemas");
  aba.textContent = "Carregando conteúdos…";

  try {
    const resposta = await fetch("../back/buscar_conteudos.php");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar conteúdos");
    }

    const conteudos = await resposta.json();
    aba.textContent = "";

    if (conteudos.length === 0) {
      aba.textContent = "Nenhum conteúdo encontrado.";
      return;
    }

    for (const conteudo of conteudos) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "track-card";
      const nome = conteudo.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

      let icone = "#i-book";
          
      if (nome.includes("geometria espacial")) {
        icone = "#i-cube";
      } else if (nome.includes("geometria analitica")) {
        icone = "#i-axis";
      } else if (nome.includes("geometria") || nome.includes("trigonometria")) {
        icone = "#i-triangle";
      } else if (nome.includes("probabilidade")) {
        icone = "#i-dice";
      } else if (nome.includes("combinatoria")) {
        icone = "#i-network";
      } else if (nome.includes("estatistica")) {
        icone = "#i-chart";
      } else if (nome.includes("porcentagem") || nome.includes("juros")) {
        icone = "#i-percent";
      } else if (nome.includes("logaritm")) {
        icone = "#i-log";
      } else if (nome.includes("exponencial")) {
        icone = "#i-curve";
      } else if (nome.includes("quadratica") || nome.includes("segundo grau") || nome.includes("2º grau")) {
        icone = "#i-parabola";
      } else if (nome.includes("funcao afim") || nome.includes("primeiro grau") || nome.includes("1º grau")) {
        icone = "#i-line-chart";
      } else if (nome.includes("func")) {
        icone = "#i-function";
      } else if (nome.includes("conjuntos")) {
        icone = "#i-venn";
      } else if (nome.includes("elipse") || nome.includes("conicas")) {
        icone = "#i-ellipse";
      } else if (nome.includes("modulo") || nome.includes("valor absoluto")) {
        icone = "#i-absolute";
      } else if (nome.includes("progress") || nome.includes("sequencia")) {
        icone = "#i-sequence";
      } else if (nome.includes("somatorio")) {
        icone = "#i-sigma";
      } else if (nome.includes("limite")) {
        icone = "#i-infinity";
      } else if (nome.includes("matriz") || nome.includes("matrizes") || nome.includes("determinante")) {
        icone = "#i-grid";
      } else if (nome.includes("equac") || nome.includes("inequac") || nome.includes("sistema")) {
        icone = "#i-calculator";
      }
      botao.innerHTML = `
        <span class="track-card__icon" aria-hidden="true">
          + <svg class="icon"><use href="${icone}"></use></svg>
        </span>
        <strong></strong>
        <svg class="icon" aria-hidden="true"><use href="#i-chevron"></use></svg>
        `;

botao.querySelector("strong").textContent = conteudo.nome;

      botao.addEventListener("click", function () {
        carregar_questoes(conteudo.id, conteudo.nome);
      });

      aba.appendChild(botao);
    }
  } catch {
    aba.textContent = "Não foi possível carregar os conteúdos.";
  }
}  
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
    const resposta = await fetch("../back/buscar_questoes.php", {
      method: "POST",
      body: dados
    });

     if (!resposta.ok) {
      throw new Error("Erro ao buscar questões");
    }

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

  botao.addEventListener("click", function () {
    document.getElementById("titulo_questao_aberta").textContent =
      enunciado ? titulo : "Questão " + questao.id;
    document.getElementById("enunciado_questao_aberta").textContent =
      enunciado || titulo;

    areaAlternativas.textContent = "";

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

    lista.hidden = true;
    questaoAberta.hidden = false;
  });

  lista.appendChild(botao);
}
    } catch {
      lista.textContent = "Não foi possível carregar as questões.";
    }
    }


  }



function excluir_conta () {
  const lixeira = document.getElementById("excluir_conta");

  lixeira.addEventListener("click", async function () {
  if (!confirm("Tem certeza de que quer excluir sua conta?")) return;

  lixeira.disabled = true;

  try {
    const resposta = await fetch("../back/excluir_conta.php", {
      method: "POST"
    });

    const dados = await resposta.json();

    if (resposta.ok && dados.sucesso === true) {
      window.location.reload();
    } else {
      alert("Não foi possível excluir a conta.");
    }
  } catch {
    alert("Não foi possível excluir a conta.");
  } finally {
  lixeira.disabled = false;
  }
});
}
if (document.getElementById("excluir_conta")) {
  excluir_conta();
}


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
        const resposta = await fetch("../back/atualizar_perfil.php", {
          method: "POST",
          body: dados
        });

        const resultado = await resposta.json();

        if (!resposta.ok || resultado.sucesso !== true) {
          throw new Error("Atualização não confirmada");
        }

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

if (document.getElementById("appView")) {
  atualizar_campo("editar_nome", "profileFullName", "nome", "text");
  atualizar_campo("editar_nascimento", "profileBirth", "nascimento", "date");
}

