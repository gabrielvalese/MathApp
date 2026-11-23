# Mathema · front para back-end em PHP

## Estrutura
```
includes/config.php     BASE_URL, e() (escape), url() (caminho)
includes/topo.php       <!doctype>…<body> + cabeçalho (usa $titulo, $shell, $ativo, $extra_head)
includes/cabecalho.php  <header> com <nav> por perfil (public | aluno | professor)
includes/rodape.php     <footer> + </body></html>
pages/…/*.php           cada página define as variáveis, inclui topo.php, escreve o <main> e inclui rodape.php
```
- Ajuste `BASE_URL` em `includes/config.php`.
- Cada página começa com `$titulo`, `$shell` e `$ativo`; para ler o banco, faça a consulta no topo da página (antes do `require`) e imprima com `<?= e($valor) ?>`.
- Todos os links internos agora apontam para `.php`.
- Os gráficos não têm mais animação; desenham direto com os `data-*`.
- Tags semânticas: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`; cabeçalhos de painel, rodapés de questão e cartões de estatística usam `<header>`, `<footer>` e `<article>`.
- Os "slots" (`data-slot`) e listas (`data-list` + `<template>`) abaixo continuam valendo para preencher via JS/`fetch`; em PHP você também pode imprimir os valores direto no HTML e ignorar o JS.

---

# Mathema · guia para ligar o back-end

Este front-end foi limpo: **não há mais nenhum dado de exemplo, regra de negócio ou persistência local**. O que o servidor precisa fornecer virou *slot*, *lista com template* ou *evento*. Layout, CSS e comportamentos puramente visuais (abas, diálogos, rascunho com desenho/LaTeX, gráficos, cronômetro) continuam funcionando.

## O que foi removido

| Antes (simulado no front) | Agora |
|---|---|
| Nome, pontuação e iniciais do usuário no cabeçalho | `[data-slot="user.*"]` |
| Login/cadastro "de mentira" (qualquer código de 6 dígitos entrava, redirecionava direto) | Formulários só emitem `mathema:submit`; o servidor decide e chama `go()` |
| Botão Google que pulava direto para o sucesso | `data-act="login-google"` / `"cadastro-google"` |
| Trilha, ramificações, salas, atividades, ranking, competições, simulados, resultados, banco e questões do professor (HTML fixo) | Listas vazias + `<template>` com a linha-modelo |
| Banco de 10 questões da trilha **com gabarito** em `quiz.js` | `Mathema.lesson.start({ questions, check })`; a correção é do servidor |
| Gabarito e explicação em `data-answer` / `data-explain` na página de questão | Removidos. `Mathema.workspace.showResult(...)` mostra o que o servidor devolver |
| Rascunhos, desenhos e LaTeX salvos em `localStorage` | Eventos `mathema:draft-save` / `mathema:draft-delete` + `Mathema.workspace.setDrafts(...)` |
| XP calculado no navegador (10 / 5) | Vem de `check()` (`xp`) |
| Mapa de calor com dados aleatórios | `data-days` (JSON `{"AAAA-MM-DD": n}`) |
| Código de sala gerado no navegador, remoção de aluno só no DOM, avisos "toast" falsos | `data-act` + o servidor responde |
| Redirecionamento falso do simulado (`data-href`) | Formulário `simulado-criar` emite `mathema:submit` |

Permaneceu (é interface, não dado): textos institucionais, a página inicial (`index.php`), rótulos fixos e as opções de filtro (temas, tipos de prova) do simulado, do banco e de "questões finais". Se essas listas passarem a vir do banco de dados, troque-as por `data-list` + template como as demais.

## Como conectar (arquivo `assets/js/ui.js`, objeto `window.Mathema`)

```js
// 1. Preencher textos soltos: <span data-slot="user.nome"></span>
Mathema.fill({ user: { nome: "Marina", iniciais: "MS", pontuacao: "1.240" } });

// 2. Preencher listas: <div data-list="aluno.salas"></div> + <template data-template="aluno.salas">…{{campo}}…</template>
Mathema.renderList("aluno.salas", [{ id: 1, nome: "3º Ano A", /* … */ }]);
//   renderList(nome, itens, raiz?, { template: "outro.nome", append: true })
//   {{campo}} escapa o texto · {{{campo}}} insere HTML (o servidor deve sanitizar)
//   Listas aninhadas: chame renderList de novo passando o elemento criado como `raiz`.

// 3. Eventos
document.addEventListener("mathema:submit", (e) => {      // todo <form data-form="nome">
  const { name, data, go, close, reset } = e.detail;       // data = campos (OTP em data.codigo)
  e.preventDefault();                                      // impede avançar a etapa sozinho
  /* chamar a API… e então */ go();                        // avança para data-next-step
});
document.addEventListener("mathema:action", (e) => {       // todo [data-act="nome"] [data-id]
  const { action, id, el } = e.detail;
});
```

Outras funções: `Mathema.goStep(wrap, n)`, `Mathema.toast(msg)`, `Mathema.init(raiz)` (reativa abas/diálogos/etc. em HTML inserido depois; depois de montar `trilha.abas`, chame `Mathema.init(document.querySelector("[data-tabs]"))`), `Mathema.charts.render(el)` (depois de definir `data-*` de gráfico).

**Rascunho / resposta** (`workspace.js`): `mathema:draft-save` traz `{ workspace, question, tex, strokes, image }`; devolva a lista com `Mathema.workspace.setDrafts("atual", [{ id, img, tex, strokes, time }])`. O botão `[data-check]` emite `mathema:answer-submit` com `{ question, value, scope }`; responda com `Mathema.workspace.showResult(scope, { correct, gabarito, explanation })`. O id da questão é lido do ancestral `[data-question-id]` (defina-o na `<main>` ou no painel). Nas páginas de questão única o espaço de rascunho se chama `"atual"`.

**Lição da trilha** (`quiz.js`): `Mathema.lesson.start({ title, questions, check, backHref, againHref })`. Formatos das questões e da resposta estão no cabeçalho do arquivo. `check(questao, resposta)` devolve `{ ok, hint, xp }`. Envie `steps` já embaralhado nas questões `tokens`. Se o script do back-end carregar depois, escute `mathema:lesson-ready`.

**Barras de progresso:** `<div class="ticks" data-progress="6" data-total="10">`. **Cronômetro:** defina `data-timer` (segundos) e chame `Mathema.init(el)`; ao zerar abre o `<dialog>` de `data-on-end`.

## O que cada página espera

### `aluno/competicao.php`
- **Dados (slots):** `competicao.titulo`, `competicao.professor`
- **Listas (templates):** `competicao.abas`, `competicao.paineis`, `competicao.tags`, `competicao.alternativas`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** `enviar-tudo`, `enviar-resposta-aberta`, `enviar-resposta-fechada`

### `aluno/competicoes.php`
- **Dados (slots):** —
- **Listas (templates):** `competicoes.abertas`, `competicoes.encerradas`, `ranking.geral`, `competicoes.tags`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** `inscrever-competicao`

### `aluno/dashboard.php`
- **Dados (slots):** `user.nome`, `user.sequencia_texto`, `stats.pontuacao`, `stats.pontuacao_nota`, `stats.acertos_primeira`, `stats.acertos_primeira_nota`, `stats.questoes`, `stats.questoes_nota`, `stats.posicao`, `stats.posicao_nota`, `parou.unidade`, `parou.ramificacao`, `parou.feitas`, `parou.progresso_texto`, `prazo.titulo`, `prazo.detalhe`
- **Listas (templates):** `dashboard.unidades`, `dashboard.ranking`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** —

### `aluno/perfil.php`
- **Dados (slots):** `user.iniciais`, `user.nome`, `user.serie_escola`, `perfil.questoes`, `perfil.certas_primeira`, `perfil.certas_primeira_nota`, `perfil.pontuacao`, `perfil.sequencia`
- **Listas (templates):** `perfil.provas`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** —

### `aluno/questao.php`
- **Dados (slots):** `questao.lista_titulo`, `questao.numero_label`, `questao.enunciado_html`, `questao.figura_html`
- **Listas (templates):** `questao.tags`, `questao.alternativas`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** — · botão `data-check` (`mathema:answer-submit`)

### `aluno/sala.php`
- **Dados (slots):** `sala.nome`, `sala.professor`, `sala.alunos`, `sala.codigo`, `sala.andamento_atividades`, `sala.andamento_atividades_pct`, `sala.andamento_acertos`, `sala.andamento_acertos_pct`
- **Listas (templates):** `sala.categorias`, `sala.atividades`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** —

### `aluno/salas.php`
- **Dados (slots):** —
- **Listas (templates):** `aluno.salas`
- **Formulários (`mathema:submit`):** `entrar-sala`
- **Ações (`mathema:action`):** —

### `aluno/simulado-questao.php`
- **Dados (slots):** `simulado.titulo`, `simulado.posicao`, `simulado.enunciado_html`
- **Listas (templates):** `simulado.navegacao`, `simulado.tags`, `simulado.alternativas`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** `finalizar-simulado`, `questao-anterior`, `marcar-revisao`, `salvar-proxima`

### `aluno/simulado-resultado.php`
- **Dados (slots):** `resultado.acertos`, `resultado.total`, `resultado.resumo`, `resultado.acertos_nota`, `resultado.tempo`, `resultado.tempo_nota`, `resultado.em_branco`, `resultado.em_branco_nota`, `resultado.pontos`
- **Listas (templates):** `resultado.conteudos`, `resultado.navegacao`, `resultado.revisao`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** —

### `aluno/simulado.php`
- **Dados (slots):** —
- **Listas (templates):** —
- **Formulários (`mathema:submit`):** `simulado-criar`
- **Ações (`mathema:action`):** —

### `aluno/trilha-exercicio.php`
- **Dados (slots):** —
- **Listas (templates):** —
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** —

### `aluno/trilha-final.php`
- **Dados (slots):** `final.unidade`
- **Listas (templates):** `final.conteudos`, `final.questoes`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** —

### `aluno/trilha.php`
- **Dados (slots):** —
- **Listas (templates):** `trilha.abas`, `trilha.paineis`, `trilha.nos`, `trilha.topicos`
- **Formulários (`mathema:submit`):** —
- **Ações (`mathema:action`):** —

### `auth/cadastro-aluno.php`
- **Dados (slots):** —
- **Listas (templates):** —
- **Formulários (`mathema:submit`):** `cadastro-aluno`, `cadastro-aluno-otp`
- **Ações (`mathema:action`):** `cadastro-google`, `reenviar-codigo`

### `auth/cadastro-professor.php`
- **Dados (slots):** —
- **Listas (templates):** —
- **Formulários (`mathema:submit`):** `cadastro-professor`
- **Ações (`mathema:action`):** —

### `auth/login-aluno.php`
- **Dados (slots):** —
- **Listas (templates):** —
- **Formulários (`mathema:submit`):** `login-aluno-email`, `login-aluno-otp`
- **Ações (`mathema:action`):** `login-google`, `reenviar-codigo`

### `auth/login-professor.php`
- **Dados (slots):** —
- **Listas (templates):** —
- **Formulários (`mathema:submit`):** `login-professor-senha`, `login-professor-otp`
- **Ações (`mathema:action`):** `reenviar-codigo`

### `professor/banco.php`
- **Dados (slots):** —
- **Listas (templates):** `banco.questoes`, `prof.opcoes_salas`, `prof.opcoes_categorias`
- **Formulários (`mathema:submit`):** `adicionar-banco-sala`
- **Ações (`mathema:action`):** `selecionar-questao`

### `professor/minhas-questoes.php`
- **Dados (slots):** —
- **Listas (templates):** `minhas.questoes`, `prof.opcoes_temas`
- **Formulários (`mathema:submit`):** `criar-questao`
- **Ações (`mathema:action`):** `editar-questao`

### `professor/sala.php`
- **Dados (slots):** `sala.nome`, `sala.codigo`, `sala.alunos_count`, `prof.rascunho_titulo`, `prof.rascunho_status`
- **Listas (templates):** `prof.categorias`, `prof.alunos`, `prof.rascunho_itens`, `prof.rascunho_alunos`, `prof.desempenho_categorias`, `prof.desempenho_alunos`, `prof.atividades`, `prof.opcoes_categorias`
- **Formulários (`mathema:submit`):** `adicionar-questao-sala`, `criar-categoria`
- **Ações (`mathema:action`):** `remover-aluno`

### `professor/salas.php`
- **Dados (slots):** `sala.codigo_novo`
- **Listas (templates):** `professor.salas`
- **Formulários (`mathema:submit`):** `criar-sala`
- **Ações (`mathema:action`):** `gerar-codigo`

## Pontos de atenção (decisões que ficam com o back-end)

1. **Gabarito nunca vai para o navegador** antes da correção. No simulado e na competição, a correção só vem no fim.
2. **Sanitize** todo HTML enviado em `{{{ }}}` e `data-slot-html` (enunciados, figuras). Esses pontos usam `innerHTML`.
3. **Formulários incompletos no protótipo:** "Adicionar questão à sala" (professor) tem só enunciado e formato, sem alternativas nem gabarito; "Nova questão" tem gabarito mas não alternativas. Definam o modelo de questão antes de ligar.
4. **Fluxos de e-mail/OTP** (login do aluno, cadastro, login do professor com senha + código) e a **aprovação manual do professor** (e-mail institucional + imagem do currículo, campo `file`) são só telas; no `mathema:submit` do cadastro do professor, `data.curriculo` chega como objeto `File` (use `FormData` para enviar).
5. **Limites de regra** que hoje aparecem só como texto: 100 alunos por sala, 10 questões por ramificação, código de sala com 6 caracteres.
6. A fila "errou → volta ao fim" está no `quiz.js` como comportamento de interface. Se o servidor precisar controlar a ordem, mova essa lógica para lá.
7. O KaTeX vem de CDN (`cdnjs`) nas páginas com LaTeX; sem ele a pré-visualização mostra o texto cru.
8. Correção feita no front: o mapa de calor não mostrava os dias da semana atual depois do domingo; agora a última coluna é a semana corrente.
