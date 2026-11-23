/* Exercícios da trilha (estilo Duolingo). Aqui só há interface e fluxo da fila:
   "errou, a questão volta para o fim da fila até ser acertada".
   Perguntas e correção vêm do back-end:

   Mathema.lesson.start({
     title:     "Equações do 1º grau",
     questions: [ ... ],                       // formatos abaixo
     check:     async (questao, resposta) => ({ ok: true|false, hint: "texto", xp: 10 }),
     backHref:  "trilha.php",  againHref: "trilha-exercicio.php?ramificacao=ID"
   })

   Formatos de questão (sem gabarito: ele fica só no servidor):
     { id, type: "balance", left: { x: 1, units: 3 }, right: { units: 8 } }   resposta: número
     { id, type: "tokens",  prompt: "...", steps: ["x = 5", "x + 7 = 12"] }   resposta: lista de passos na ordem escolhida
                                                                              (envie `steps` já embaralhado)
     { id, type: "root",    a: 2, b: -4 }                                     resposta: número (x onde a reta cruza y = 0) */
(function () {
  const root = document.getElementById("lesson");
  if (!root) return;
  const M = (window.Mathema = window.Mathema || {});

  const $ = (s, r = root) => r.querySelector(s);
  const ticksBox = $("[data-ticks]"), xpBox = $("[data-xp]"), body = $("[data-body]"), bar = $("[data-bar]"), fb = $("[data-fb]"), act = $("[data-action]");
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sign = (n) => (n < 0 ? "−" : "+");

  let cfg = null, queue = [], total = 0, done = 0, xp = 0, firstTry = 0, mode = "check", current = null, api = null;

  const paintTicks = () => [...ticksBox.children].forEach((t, i) => { t.className = i < done ? "on" : i === done ? "now" : ""; });

  /* Tipos de questão */
  function renderBalance(q, ready) {
    const blocks = (s) => '<span class="blk blk--x">x</span>'.repeat(s.x || 0) + '<span class="blk">1</span>'.repeat(s.units || 0);
    const lhs = (q.left.x > 1 ? q.left.x : "") + "x" + (q.left.units ? " + " + q.left.units : "");
    body.querySelector("[data-prompt]").textContent = "A balança está em equilíbrio. Quanto vale x?";
    $("[data-stage]").innerHTML = `<div class="scale" role="img" aria-label="Equação ${lhs} = ${q.right.units}"><div class="pan">${blocks(q.left)}</div><div class="fulcrum"></div><div class="pan">${blocks(q.right)}</div></div>
      <div class="eq">${lhs} = ${q.right.units}</div>
      <label class="sr-only" for="ans">Valor de x</label><input id="ans" class="answer-input" inputmode="numeric" autocomplete="off" placeholder="x = ?">`;
    const inp = $("#ans"); inp.focus();
    inp.addEventListener("input", () => ready(inp.value.trim() !== ""));
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !act.disabled) act.click(); });
    return { answer: () => Number(inp.value.replace(",", ".")), lock: () => (inp.disabled = true) };
  }

  function renderTokens(q, ready) {
    body.querySelector("[data-prompt]").textContent = q.prompt;
    $("[data-stage]").innerHTML = `<div class="answer-line" data-line aria-live="polite"></div><div class="bank" data-bank></div>`;
    const line = $("[data-line]"), bank = $("[data-bank]");
    const order = q.steps.map((s, i) => ({ s, i }));
    let picked = [];
    const draw = () => {
      line.innerHTML = ""; bank.innerHTML = "";
      picked.forEach((p, k) => { const b = document.createElement("button"); b.type = "button"; b.className = "tk"; b.textContent = p.s; b.setAttribute("aria-label", "Remover passo: " + p.s); b.addEventListener("click", () => { if (mode !== "check") return; picked.splice(k, 1); draw(); }); line.appendChild(b); });
      order.forEach((o) => { const used = picked.includes(o); const b = document.createElement("button"); b.type = "button"; b.className = "tk" + (used ? " is-ghost" : ""); b.textContent = o.s; b.disabled = used; b.addEventListener("click", () => { if (mode !== "check") return; picked.push(o); draw(); }); bank.appendChild(b); });
      ready(picked.length === q.steps.length);
    };
    draw();
    return { answer: () => picked.map((p) => p.s), lock: () => {} };
  }

  function planeSvg(a, b, x) {
    const u = 24, W = 10 * u, H = 12 * u, X = (v) => (v + 3) * u, Y = (v) => (6 - v) * u, f = (v) => a * v + b;
    let s = `<svg class="plane" viewBox="0 0 ${W} ${H}" role="img" aria-label="Reta y = ${a}x ${sign(b)} ${Math.abs(b)} e ponto em x = ${x}">`;
    for (let i = -3; i <= 7; i++) s += `<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="${H}" stroke="#e6e8ec"/>`;
    for (let j = -6; j <= 6; j++) s += `<line x1="0" y1="${Y(j)}" x2="${W}" y2="${Y(j)}" stroke="#e6e8ec"/>`;
    s += `<line x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}" stroke="#1a1a1c" stroke-width="1.5"/><line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${H}" stroke="#1a1a1c" stroke-width="1.5"/>`;
    for (let i = -2; i <= 6; i += 2) if (i) s += `<text x="${X(i)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="#868a94">${i}</text>`;
    s += `<line x1="${X(-3)}" y1="${Y(f(-3))}" x2="${X(7)}" y2="${Y(f(7))}" stroke="#1a1a1c" stroke-width="2.5"/>`;
    s += `<circle cx="${X(x)}" cy="${Y(f(x))}" r="7" fill="#ff5a1f" stroke="#fff" stroke-width="2"/></svg>`;
    return s;
  }

  function renderRoot(q, ready) {
    const eq = `${q.a === 1 ? "" : q.a === -1 ? "−" : q.a}x ${sign(q.b)} ${Math.abs(q.b)}`;
    body.querySelector("[data-prompt]").textContent = `Mova o ponto até y = 0 e descubra a solução de ${eq} = 0.`;
    $("[data-stage]").innerHTML = `<div data-plane></div><div class="readout" data-read aria-live="polite"></div>
      <label class="sr-only" for="sx">Valor de x</label><input id="sx" type="range" min="-3" max="7" step="1" value="-1" style="max-width:320px">`;
    const sl = $("#sx"), plane = $("[data-plane]"), read = $("[data-read]");
    const upd = () => { const x = +sl.value; plane.innerHTML = planeSvg(q.a, q.b, x); read.innerHTML = `x = <b>${x}</b> · y = <b>${q.a * x + q.b}</b>`; ready(true); };
    sl.addEventListener("input", upd); upd();
    return { answer: () => +sl.value, lock: () => (sl.disabled = true) };
  }

  const RENDER = { balance: renderBalance, tokens: renderTokens, root: renderRoot };

  /* Fluxo */
  function setBar(state, html) {
    bar.className = "lesson__bar" + (state ? " is-" + state : "");
    fb.innerHTML = html || "";
  }

  function next() {
    if (!queue.length) return finish();
    current = queue.shift(); mode = "check";
    paintTicks(); setBar("", "");
    body.innerHTML = `<p class="lesson__kind">${esc(cfg.title || "")} · ${Math.min(done + 1, total)} de ${total}</p><h1 class="lesson__prompt" data-prompt></h1><div class="stage" data-stage></div>`;
    act.textContent = "Verificar"; act.disabled = true; act.className = "btn btn--primary";
    api = RENDER[current.type](current, (r) => { if (mode === "check") act.disabled = !r; });
    document.title = "Exercício " + (done + 1) + " · Mathema";
  }

  async function check() {
    act.disabled = true;
    let res;
    try { res = await cfg.check(current, api.answer()); }
    catch (e) { act.disabled = false; setBar("bad", "<strong>Não foi possível verificar.</strong>Tente de novo."); return; }
    api.lock && api.lock();
    current.tries = (current.tries || 0) + 1;
    mode = "continue";
    if (res.ok) {
      done++; xp += res.xp || 0; if (current.tries === 1) firstTry++;
      xpBox.textContent = "+" + xp + " XP"; paintTicks();
      setBar("ok", "<strong>Isso mesmo.</strong>" + (current.tries === 1 ? "Acertou de primeira." : "Agora fixou."));
    } else {
      queue.push(current);
      setBar("bad", "<strong>Ainda não.</strong>" + esc(res.hint || "") + " Ela volta no fim da fila.");
    }
    act.textContent = "Continuar"; act.disabled = false; act.className = "btn btn--dark";
    act.focus();
  }

  function finish() {
    paintTicks(); bar.hidden = true;
    body.innerHTML = `<div class="lesson-done"><span class="success-mark" aria-hidden="true">✓</span>
      <h1>Ramificação concluída</h1>
      <p class="muted">Você acertou ${firstTry} de ${total} de primeira e ganhou <strong>${xp} XP</strong>.</p>
      <div class="row"><a class="btn btn--primary" href="${esc(cfg.backHref || "trilha.php")}">Voltar à trilha</a><a class="btn" href="${esc(cfg.againHref || location.href)}">Praticar de novo</a></div></div>`;
    document.dispatchEvent(new CustomEvent("mathema:lesson-finished", { detail: { firstTry, total, xp } }));
  }

  function start(config) {
    cfg = config;
    queue = config.questions.map((q) => ({ ...q, tries: 0 }));
    total = queue.length; done = 0; xp = 0; firstTry = 0;
    bar.hidden = false; xpBox.textContent = "+0 XP";
    ticksBox.innerHTML = "<i></i>".repeat(total);
    next();
  }

  act.addEventListener("click", () => (mode === "check" ? check() : next()));
  M.lesson = { start };
  document.dispatchEvent(new Event("mathema:lesson-ready"));
})();
