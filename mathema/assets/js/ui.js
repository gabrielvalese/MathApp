/* Interações gerais da interface. Sem dados e sem regras de negócio.

   Pontos de integração com o back-end (tudo em window.Mathema):
   - Mathema.fill(dados, raiz)                    preenche [data-slot="a.b"], [data-slot-html], [data-slot-width]
   - Mathema.renderList(nome, itens, raiz, opts)  clona <template data-template="nome"> dentro de [data-list="nome"]
                                                  opts: { template: "outro-nome", append: true }
   - Mathema.init(raiz)                           reativa comportamentos em HTML inserido depois
   - Mathema.goStep(wrap, n) / Mathema.toast(msg)
   - Evento "mathema:submit"  em form[data-form]   detail: { name, form, data, next, go(), close(), reset() }
                              preventDefault() impede o avanço automático de etapa
   - Evento "mathema:action"  em [data-act]        detail: { action, id, el } */
(function () {
  const M = (window.Mathema = window.Mathema || {});
  M.hooks = M.hooks || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => { const l = [...r.querySelectorAll(s)]; if (r.matches && r.matches(s)) l.unshift(r); return l; };

  /* Toast */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  }
  window.toast = M.toast = toast;

  /* Preenchimento de dados (slots e listas) */
  const get = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  M.fill = function (data, root = document) {
    $$("[data-slot]", root).forEach((el) => {
      const v = get(data, el.dataset.slot); if (v == null) return;
      if (el.hasAttribute("data-progress")) { el.dataset.progress = v; init(el); } else el.textContent = v;
    });
    $$("[data-slot-html]", root).forEach((el) => { const v = get(data, el.dataset.slotHtml); if (v != null) el.innerHTML = v; }); /* HTML vindo do servidor: sanitize no back-end a*/
    $$("[data-slot-width]", root).forEach((el) => { const v = get(data, el.dataset.slotWidth); if (v != null) el.style.width = v + "%"; });
  };

  M.renderList = function (name, items, root = document, opts = {}) {
    const box = $(`[data-list="${name}"]`, root), tpl = document.querySelector(`template[data-template="${opts.template || name}"]`);
    if (!box || !tpl) return [];
    if (!opts.append) box.innerHTML = "";
    const made = [];
    items.forEach((item) => {
      /* {{campo}} escapa o texto; {{{campo}}} insere HTML cru (o servidor deve sanitizar) */
      const html = tpl.innerHTML
        .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (_, k) => get(item, k) ?? "")
        .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => esc(get(item, k) ?? ""));
      const holder = document.createElement("template"); holder.innerHTML = html.trim();
      const nodes = [...holder.content.children]; box.appendChild(holder.content);
      nodes.forEach((n) => { init(n); made.push(n); });
    });
    return made;
  };

  /* Etapas (cadastro/login) */
  function goStep(wrap, n) {
    const steps = $$("[data-step]", wrap);
    steps.forEach((s) => (s.hidden = s.dataset.step !== String(n)));
    const f = $("input:not([type=hidden]), button.btn", steps.find((s) => !s.hidden) || wrap);
    if (f && String(n) !== "1") f.focus();
  }
  M.goStep = goStep;

  function init(root) {
    /* Barra de progresso em 10 marcas: <div class="ticks" data-progress="6" data-total="10"> */
    $$("[data-progress]", root).forEach((el) => {
      const done = +el.dataset.progress || 0, total = +el.dataset.total || 10;
      el.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < done ? "on" : i === done && done > 0 ? "now" : ""}"></i>`).join("");
    });

    /* Abas: <div role=tablist data-tabs> <button role=tab aria-controls=id> */
    $$("[data-tabs]", root).forEach((list) => {
      const tabs = () => $$('[role="tab"]', list);
      const select = (tab) => {
        tabs().forEach((t) => {
          const on = t === tab;
          t.setAttribute("aria-selected", on);
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        window.dispatchEvent(new Event("resize"));
      };
      if (!list._bound) {
        list._bound = true;
        list.addEventListener("click", (e) => { const t = e.target.closest('[role="tab"]'); if (t && list.contains(t)) select(t); });
        list.addEventListener("keydown", (e) => {
          const all = tabs(), i = all.indexOf(document.activeElement);
          if (i < 0 || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
          const n = all[(i + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length];
          n.focus(); select(n);
        });
      }
      const all = tabs();
      if (all.length) select(all.find((t) => t.getAttribute("aria-selected") === "true") || all[0]);
    });

    /* Diálogos */
    $$("[data-dialog-open]", root).forEach((b) => b.addEventListener("click", () => { const d = document.getElementById(b.dataset.dialogOpen); if (d && d.showModal) d.showModal(); }));
    $$("[data-dialog-close]", root).forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
    $$("dialog", root).forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

    /* Etapas: <div data-steps> <section data-step="1"> ... */
    $$("[data-steps]", root).forEach((wrap) => {
      if (wrap._bound) return; wrap._bound = true;
      goStep(wrap, 1);
      $$("[data-goto]", wrap).forEach((b) => b.addEventListener("click", () => goStep(wrap, b.dataset.goto)));
    });

    /* Formulários: <form data-form="nome" [data-next-step="2"]>. O envio é do back-end. */
    $$("form[data-form]", root).forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!f.checkValidity()) return f.reportValidity();
      const wrap = f.closest("[data-steps]"), next = f.dataset.nextStep;
      const emailField = $('input[type="email"]', f);
      if (wrap && emailField) $$("[data-email]", wrap).forEach((el) => (el.textContent = emailField.value));
      const data = Object.fromEntries(new FormData(f));
      const otp = $(".otp", f); if (otp) data.codigo = $$("input", otp).map((i) => i.value).join("");
      const ev = new CustomEvent("mathema:submit", {
        bubbles: true, cancelable: true,
        detail: { name: f.dataset.form, form: f, data, next, go: () => wrap && next && goStep(wrap, next), close: () => { const d = f.closest("dialog"); if (d) d.close(); }, reset: () => f.reset() },
      });
      if (f.dispatchEvent(ev) && wrap && next) goStep(wrap, next);
    }));

    /* Ações: <button data-act="nome" data-id="123"> */
    $$("[data-act]", root).forEach((b) => b.addEventListener("click", () =>
      b.dispatchEvent(new CustomEvent("mathema:action", { bubbles: true, detail: { action: b.dataset.act, id: b.dataset.id, el: b } }))));

    /* Código de verificação (6 dígitos) */
    $$(".otp", root).forEach((otp) => {
      const inputs = $$("input", otp), form = otp.closest("form");
      const sync = () => { const full = inputs.every((i) => i.value); const btn = form && $("[data-otp-submit]", form); if (btn) btn.disabled = !full; };
      inputs.forEach((inp, i) => {
        inp.addEventListener("input", () => { inp.value = inp.value.replace(/\D/g, "").slice(-1); if (inp.value && inputs[i + 1]) inputs[i + 1].focus(); sync(); });
        inp.addEventListener("keydown", (e) => { if (e.key === "Backspace" && !inp.value && inputs[i - 1]) inputs[i - 1].focus(); });
        inp.addEventListener("paste", (e) => {
          const t = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
          if (!t) return; e.preventDefault();
          [...t].forEach((c, k) => { if (inputs[k]) inputs[k].value = c; });
          inputs[Math.min(t.length, 5)].focus(); sync();
        });
      });
      sync();
    });

    /* Copiar */
    $$("[data-copy]", root).forEach((b) => b.addEventListener("click", () => {
      const t = document.querySelector(b.dataset.copy);
      if (!t) return;
      (navigator.clipboard ? navigator.clipboard.writeText(t.textContent.trim()) : Promise.resolve()).finally(() => toast("Código copiado."));
    }));

    /* Filtros por chips: <div data-filter-group="#lista"><input type=radio data-filter="enem"> + itens [data-tags="enem obmep"] */
    $$("[data-filter-group]", root).forEach((g) => {
      const list = $(g.dataset.filterGroup);
      g.addEventListener("change", () => {
        const on = $$("input:checked", g).map((i) => i.dataset.filter).filter((v) => v !== "all");
        $$("[data-tags]", list).forEach((it) => { const tags = it.dataset.tags.split(" "); it.hidden = on.length && !on.some((t) => tags.includes(t)); });
      });
    });

    /* Montagem do simulado (só interface: resumo ao vivo) */
    $$("[data-sim]", root).forEach((sim) => {
      const qty = $("#sim-qty", sim), timer = $("#sim-timer", sim), mins = $("#sim-mins", sim);
      const out = () => {
        $("[data-out-qty]", sim).textContent = qty.value;
        mins.disabled = !timer.checked;
        $("[data-sum-qty]").textContent = qty.value + " questões";
        $("[data-sum-time]").textContent = timer.checked ? mins.value + " minutos" : "Sem cronômetro";
        const themes = $$('[name="tema"]:checked', sim).length, types = $$('[name="tipo"]:checked', sim).length;
        $("[data-sum-themes]").textContent = themes ? themes + " temas escolhidos" : "Todos os temas";
        $("[data-sum-types]").textContent = types ? types + " tipos escolhidos" : "Todos os tipos";
      };
      sim.addEventListener("input", out); sim.addEventListener("change", out); out();
    });

    /* Upload de imagem com pré-visualização */
    $$("[data-upload]", root).forEach((inp) => inp.addEventListener("change", () => {
      const box = document.querySelector(inp.dataset.upload);
      if (!box) return;
      box.innerHTML = "";
      [...inp.files].forEach((f) => {
        if (!f.type.startsWith("image/")) return;
        const img = document.createElement("img"); img.alt = "Pré-visualização de " + f.name; img.src = URL.createObjectURL(f); box.appendChild(img);
      });
      const name = inp.closest(".dropzone") && inp.closest(".dropzone").querySelector("[data-file-name]");
      if (name && inp.files.length) name.textContent = inp.files.length + " arquivo(s) selecionado(s)";
    }));

    /* Controle deslizante com saída */
    $$("input[type=range][data-out]", root).forEach((r) => { const o = document.querySelector(r.dataset.out); const u = () => (o.textContent = r.value); r.addEventListener("input", u); u(); });

    /* Cronômetro regressivo: <span data-timer="SEGUNDOS" data-on-end="id-do-dialog">. Sem valor, fica parado. */
    $$("[data-timer]", root).forEach((el) => {
      let left = parseInt(el.dataset.timer, 10);
      if (!(left >= 0) || el._running) return; el._running = true;
      const fmt = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : String(m).padStart(2, "0")) + ":" + String(x).padStart(2, "0"); };
      const tick = () => {
        el.textContent = fmt(left);
        el.classList.toggle("is-low", left <= 60);
        if (left <= 0) { clearInterval(iv); const d = document.getElementById(el.dataset.onEnd); if (d && d.showModal) d.showModal(); return; }
        left--;
      };
      const iv = setInterval(tick, 1000); tick();
    });

    M.hooks.forEach((h) => h(root));
  }

  M.init = init;
  init(document);
})();

/* Menu responsivo (antes ficava em shell.js; agora o cabeçalho vem do PHP). */
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector(".burger"), nav = document.getElementById("main-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () { btn.setAttribute("aria-expanded", nav.classList.toggle("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) nav.classList.remove("is-open"); });
});
