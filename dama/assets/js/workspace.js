/* Espaço de rascunho: desenho (mouse/toque) e LaTeX com pré-visualização.
   Nada é salvo aqui: o back-end recebe eventos e devolve dados.

   Eventos (burbulham a partir do elemento [data-workspace]):
   - "mathema:draft-save"    detail: { workspace, question, tex, strokes, image }
   - "mathema:draft-delete"  detail: { workspace, question, id }
   - "mathema:answer-submit" (botão [data-check])  detail: { question, value, scope, button }

   API: Mathema.workspace.setDrafts(chave, [{ id, img, tex, strokes, time }])
        Mathema.workspace.getState(chave) / setState(chave, { strokes, tex })
        Mathema.workspace.showResult(escopo, { correct, gabarito, explanation })
   "chave" é o valor de data-workspace (e de data-drafts, que liga a lista de rascunhos). */
(function () {
  const M = (window.Mathema = window.Mathema || {});
  M.hooks = M.hooks || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const api = {};

  function init(ws) {
    if (ws._ready) return; ws._ready = true;
    const qid = ws.dataset.workspace;
    const canvas = $("canvas", ws), ctx = canvas.getContext("2d");
    const tex = $("textarea", ws), preview = $(".pad__preview", ws);
    const draftsBox = document.querySelector(`[data-drafts="${qid}"]`);
    const questionId = () => { const q = ws.closest("[data-question-id]"); return q ? q.dataset.questionId : null; };
    let strokes = [], drafts = [], tool = "pen", color = "#1a1a1c", size = 2.5, cur = null;

    /* Desenho */
    function paint(s) {
      ctx.save();
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.globalCompositeOperation = s.tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = s.color; ctx.lineWidth = s.tool === "eraser" ? 18 : s.size;
      ctx.beginPath();
      s.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      if (s.pts.length === 1) ctx.lineTo(s.pts[0][0] + 0.01, s.pts[0][1]);
      ctx.stroke(); ctx.restore();
    }
    function redraw() { ctx.clearRect(0, 0, canvas.width, canvas.height); strokes.forEach(paint); }
    function resize() {
      const r = canvas.getBoundingClientRect(); if (!r.width) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); redraw();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas); else window.addEventListener("resize", resize);
    resize();

    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener("pointerdown", (e) => { canvas.setPointerCapture(e.pointerId); cur = { tool, color, size, pts: [pos(e)] }; strokes.push(cur); paint(cur); });
    canvas.addEventListener("pointermove", (e) => { if (!cur) return; cur.pts.push(pos(e)); redraw(); });
    const end = () => { cur = null; };
    canvas.addEventListener("pointerup", end); canvas.addEventListener("pointercancel", end);

    $$("[data-tool]", ws).forEach((b) => b.addEventListener("click", () => {
      const t = b.dataset.tool;
      if (t === "undo") { strokes.pop(); redraw(); return; }
      if (t === "clear") { strokes = []; redraw(); return; }
      $$("[data-tool]:not([data-tool=undo]):not([data-tool=clear])", ws).forEach((x) => x.setAttribute("aria-pressed", x === b));
      if (t === "eraser") tool = "eraser"; else { tool = "pen"; color = b.dataset.color || color; }
    }));

    /* Abas Desenho / LaTeX */
    $$('[role="tab"]', ws).forEach((tab) => tab.addEventListener("click", () => {
      $$('[role="tab"]', ws).forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", on); document.getElementById(t.getAttribute("aria-controls")).hidden = !on; });
      resize();
    }));

    /* LaTeX */
    let tmr;
    function renderTex() {
      const v = tex.value.trim();
      if (!v) { preview.textContent = ""; return; }
      if (window.katex) { try { window.katex.render(v, preview, { throwOnError: false, displayMode: true }); return; } catch (e) { /* cai no texto */ } }
      preview.textContent = v;
    }
    tex.addEventListener("input", () => { clearTimeout(tmr); tmr = setTimeout(renderTex, 150); });

    /* Lista de rascunhos (dados vêm do back-end via setDrafts) */
    function thumb() {
      const t = document.createElement("canvas"); t.width = 320; t.height = 240;
      const c = t.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, 320, 240);
      if (canvas.width) c.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 320, 240);
      return t.toDataURL("image/png");
    }
    function renderDrafts() {
      if (!draftsBox) return;
      const list = $(".drafts__list", draftsBox), empty = $(".drafts__empty", draftsBox);
      list.innerHTML = "";
      empty.hidden = drafts.length > 0;
      const cnt = $("[data-count]", draftsBox); if (cnt) cnt.textContent = drafts.length;
      drafts.forEach((d, i) => {
        const el = document.createElement("div"); el.className = "draft"; el.tabIndex = 0; el.setAttribute("role", "button");
        el.setAttribute("aria-label", "Reabrir rascunho " + (i + 1));
        el.innerHTML = `<img alt=""><div class="draft__tex"></div><div class="draft__meta"><span>Rascunho ${i + 1}</span><span></span></div><button class="draft__del" type="button" aria-label="Excluir rascunho ${i + 1}">×</button>`;
        $("img", el).src = d.img || "";
        $(".draft__tex", el).textContent = d.tex || "sem fórmula";
        $(".draft__meta span:last-child", el).textContent = d.time || "";
        const open = () => { strokes = (d.strokes || []).map((s) => ({ ...s })); tex.value = d.tex || ""; redraw(); renderTex(); };
        el.addEventListener("click", (e) => {
          if (e.target.closest(".draft__del")) { ws.dispatchEvent(new CustomEvent("mathema:draft-delete", { bubbles: true, detail: { workspace: qid, question: questionId(), id: d.id } })); return; }
          open();
        });
        el.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
        list.appendChild(el);
      });
    }
    renderDrafts();
    const toggle = draftsBox && $("[data-toggle-drafts]", draftsBox);
    if (toggle) toggle.addEventListener("click", () => { const c = draftsBox.classList.toggle("is-collapsed"); toggle.textContent = c ? "Mostrar" : "Ocultar"; });

    const save = $("[data-save-draft]", ws);
    if (save) save.addEventListener("click", () => {
      if (!strokes.length && !tex.value.trim()) return window.toast && window.toast("Desenhe ou escreva algo antes de salvar.");
      ws.dispatchEvent(new CustomEvent("mathema:draft-save", { bubbles: true, detail: { workspace: qid, question: questionId(), tex: tex.value.trim(), strokes: JSON.parse(JSON.stringify(strokes)), image: thumb() } }));
    });

    api[qid] = {
      setDrafts(list) { drafts = list || []; renderDrafts(); },
      getState() { return { strokes: JSON.parse(JSON.stringify(strokes)), tex: tex.value }; },
      setState(s) { strokes = (s && s.strokes) || []; tex.value = (s && s.tex) || ""; redraw(); renderTex(); },
    };
  }

  function initAll(root) {
    const r = root || document;
    const list = $$("[data-workspace]", r); if (r.matches && r.matches("[data-workspace]")) list.unshift(r);
    list.forEach(init);
  }

  M.workspace = {
    init: initAll,
    setDrafts: (k, l) => api[k] && api[k].setDrafts(l),
    getState: (k) => api[k] && api[k].getState(),
    setState: (k, s) => api[k] && api[k].setState(s),
    showResult(scope, res) {
      const alts = $(".alts", scope), box = $("[data-result]", scope), btn = $("[data-check]", scope);
      const chosen = $("input:checked", alts);
      $$(".alt", alts).forEach((a) => {
        const v = $("input", a).value;
        a.classList.toggle("is-right", v === res.gabarito);
        a.classList.toggle("is-wrong", !res.correct && !!chosen && v === chosen.value);
      });
      box.hidden = false; box.className = "result " + (res.correct ? "result--ok" : "result--bad");
      const s = document.createElement("strong"); s.textContent = res.correct ? "Resposta correta." : "Não foi dessa vez.";
      box.replaceChildren(s, document.createTextNode(res.explanation || ""));
      if (btn) btn.disabled = true;
    },
  };
  M.hooks.push(initAll);
  initAll(document);

  /* Envio da resposta objetiva: a correção é do back-end */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-check]"); if (!btn) return;
    const scope = btn.closest("[data-question]") || document;
    const chosen = $(".alts input:checked", scope);
    if (!chosen) return window.toast && window.toast("Escolha uma alternativa antes de enviar.");
    const q = btn.closest("[data-question-id]");
    btn.dispatchEvent(new CustomEvent("mathema:answer-submit", { bubbles: true, detail: { question: q ? q.dataset.questionId : null, value: chosen.value, scope, button: btn } }));
  });

  /* Marcar a questão atual como respondida no navegador do simulado */
  document.addEventListener("change", (e) => {
    const inp = e.target.closest("[data-mark-done]"); if (!inp) return;
    const n = document.querySelector(inp.dataset.markDone); if (n) n.classList.add("is-done");
  });
})();
