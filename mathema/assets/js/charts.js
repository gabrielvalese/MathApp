/* Gráficos em SVG/CSS sem dependências. Só desenham se receberem dados.
   [data-chart="heatmap"]  data-days='{"2026-10-01": 5, ...}'  (questões por dia)
   [data-chart="donut"]    data-value (0-100) data-label data-sub
   [data-chart="radar"]    data-labels="A,B,C" data-values="80,60,40"
   [data-chart="line"]     data-labels="S1,S2" data-values="58,62"
   Depois de definir os data-* via JS, chame Mathema.charts.render(elemento). */
(function () {
  const M = (window.Mathema = window.Mathema || {});
  M.hooks = M.hooks || [];
  const NS = "http://www.w3.org/2000/svg";
  const el = (n, a = {}, parent) => { const e = document.createElementNS(NS, n); Object.entries(a).forEach(([k, v]) => e.setAttribute(k, v)); if (parent) parent.appendChild(e); return e; };
  const list = (s) => (s || "").split(",").map((x) => x.trim()).filter(Boolean);
  const nums = (s) => list(s).map(Number);

  function heatmap(box) {
    let days = {}; try { days = JSON.parse(box.dataset.days || "{}"); } catch (e) { /* sem dados */ }
    if (!Object.keys(days).length) return;
    const weeks = 53, today = new Date(); today.setHours(0, 0, 0, 0);
    /* colunas = semanas (domingo a sábado); a última coluna é a semana atual, com os dias futuros ocultos */
    const start = new Date(today); start.setDate(today.getDate() - today.getDay() - (weeks - 1) * 7);
    const wrap = document.createElement("div"); wrap.className = "heat";
    const key = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const cell = document.createElement("i");
      if (d <= today) {
        const n = +days[key(d)] || 0;
        const lvl = n === 0 ? 0 : n < 5 ? 1 : n < 10 ? 2 : n < 16 ? 3 : 4;
        if (lvl) cell.className = "l" + lvl;
        cell.title = n + (n === 1 ? " questão" : " questões") + " em " + d.toLocaleDateString("pt-BR");
      } else cell.style.visibility = "hidden";
      wrap.appendChild(cell);
    }
    box.appendChild(wrap);
    box.scrollLeft = box.scrollWidth;
  }

  function donut(box) {
    const v = parseFloat(box.dataset.value); if (isNaN(v)) return;
    const r = 46, c = 2 * Math.PI * r;
    box.classList.add("donut");
    const svg = el("svg", { viewBox: "0 0 120 120", role: "img", "aria-label": `${box.dataset.label}: ${v}%` });
    el("circle", { cx: 60, cy: 60, r, fill: "none", "stroke-width": 12, class: "donut__track" }, svg);
    const arc = el("circle", { cx: 60, cy: 60, r, fill: "none", "stroke-width": 12, "stroke-linecap": "round", class: "donut__arc", transform: "rotate(-90 60 60)", "stroke-dasharray": c, "stroke-dashoffset": c * (1 - v / 100) }, svg);
    const t = el("text", { x: 60, y: 67, "text-anchor": "middle", class: "donut__v" }, svg); t.textContent = v + "%";
    box.appendChild(svg);
    const b = document.createElement("b"); b.textContent = box.dataset.label || "";
    const s = document.createElement("small"); s.textContent = box.dataset.sub || "";
    box.append(b, s);
  }

  function radar(box) {
    const labels = list(box.dataset.labels), vals = nums(box.dataset.values), n = labels.length;
    if (n < 3 || vals.length !== n) return;
    const cx = 150, cy = 140, R = 90;
    const pt = (i, k) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + Math.cos(a) * R * k, cy + Math.sin(a) * R * k]; };
    const svg = el("svg", { viewBox: "-40 0 380 290", class: "radar", role: "img", "aria-label": "Desempenho por tema: " + labels.map((l, i) => `${l} ${vals[i]}%`).join(", ") });
    [0.25, 0.5, 0.75, 1].forEach((k) => el("polygon", { class: "radar__ring", points: labels.map((_, i) => pt(i, k).join(",")).join(" ") }, svg));
    labels.forEach((l, i) => {
      const [x, y] = pt(i, 1); el("line", { class: "radar__axis", x1: cx, y1: cy, x2: x, y2: y }, svg);
      const [lx, ly] = pt(i, 1.2); const t = el("text", { class: "radar__label", x: lx, y: ly + 4, "text-anchor": lx < cx - 5 ? "end" : lx > cx + 5 ? "start" : "middle" }, svg); t.textContent = l;
    });
    el("polygon", { class: "radar__shape", points: vals.map((v, i) => pt(i, v / 100).join(",")).join(" ") }, svg);
    vals.forEach((v, i) => { const [x, y] = pt(i, v / 100); el("circle", { class: "radar__dot", cx: x, cy: y, r: 3.5 }, svg); });
    box.appendChild(svg);
  }

  function line(box) {
    const labels = list(box.dataset.labels), vals = nums(box.dataset.values), n = vals.length;
    if (n < 2 || labels.length !== n) return;
    const W = 560, H = 220, pl = 34, pr = 12, pt = 12, pb = 28;
    const x = (i) => pl + (i * (W - pl - pr)) / (n - 1), y = (v) => pt + (1 - v / 100) * (H - pt - pb);
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "linechart", role: "img", "aria-label": "Média da turma por semana: " + vals.map((v, i) => `${labels[i]} ${v}%`).join(", ") });
    [0, 25, 50, 75, 100].forEach((g) => { el("line", { class: "linechart__grid", x1: pl, x2: W - pr, y1: y(g), y2: y(g) }, svg); const t = el("text", { class: "linechart__label", x: pl - 8, y: y(g) + 4, "text-anchor": "end" }, svg); t.textContent = g; });
    const pts = vals.map((v, i) => `${x(i)},${y(v)}`);
    el("polygon", { class: "linechart__area", points: `${x(0)},${y(0)} ${pts.join(" ")} ${x(n - 1)},${y(0)}` }, svg);
    el("polyline", { class: "linechart__line", points: pts.join(" ") }, svg);
    vals.forEach((v, i) => { el("circle", { class: "linechart__dot", cx: x(i), cy: y(v), r: 4 }, svg); const t = el("text", { class: "linechart__label", x: x(i), y: H - 8, "text-anchor": "middle" }, svg); t.textContent = labels[i]; });
    box.appendChild(svg);
  }

  const fn = { heatmap, donut, radar, line };
  function render(root) {
    const boxes = [...(root || document).querySelectorAll("[data-chart]")];
    if (root && root.matches && root.matches("[data-chart]")) boxes.unshift(root);
    boxes.forEach((b) => { if (!fn[b.dataset.chart]) return; b.innerHTML = ""; b.classList.remove("donut"); fn[b.dataset.chart](b); });
  }
  M.charts = { render };
  M.hooks.push(render);
  render(document);
})();
