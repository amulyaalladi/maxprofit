const BUILDINGS = [
    { name: "T", time: 5, rate: 1500 },
    { name: "P", time: 4, rate: 1000 },
    { name: "C", time: 10, rate: 2000 },
  ];

 
  function maxProfit(n) {
    const profit = new Array(n + 1).fill(0);
    const solutions = Array.from({ length: n + 1 }, () => new Map());

    for (let t = 0; t <= n; t++) {
      let best = 0;
      let current = new Map([["0,0,0", [0, 0, 0]]]);

      BUILDINGS.forEach((b, i) => {
        if (t <= b.time) return; 
        const rem = t - b.time;
        const value = rem * b.rate + profit[rem];

        if (value > best) {
          best = value;
          current = new Map();
        }
        if (value === best) {
          for (const counts of solutions[rem].values()) {
            const next = [...counts];
            next[i] += 1;
            current.set(next.join(","), next);
          }
        }
      });

      profit[t] = best;
      solutions[t] = current;
    }
    return { earnings: profit[n], solutions: [...solutions[n].values()] };
  }

  function money(v) { return "$" + v.toLocaleString("en-US"); }

  function renderSolution(counts, n, index) {
    const [t, p, c] = counts;
    const box = document.createElement("section");
    box.className = "solution";

    const title = document.createElement("h2");
    title.textContent = `Solution ${index + 1}`;
    box.appendChild(title);

    const info = document.createElement("div");
    info.className = "counts";
    [["T", t], ["P", p], ["C", c]].forEach(([k, v]) => {
      const s = document.createElement("span");
      s.innerHTML = `${k}: <b>${v}</b>`;
      info.appendChild(s);
    });
    box.appendChild(info);

    
    const bar = document.createElement("div");
    bar.className = "timeline";
    bar.setAttribute("role", "img");
    bar.setAttribute("aria-label", `Build order across ${n} time units`);
    const order = [];
    counts.forEach((num, i) => { for (let k = 0; k < num; k++) order.push(BUILDINGS[i]); });
    let used = 0;
    order.forEach(b => {
      const seg = document.createElement("div");
      seg.className = b.name;
      seg.style.flex = String(b.time);
      seg.textContent = b.name;
      bar.appendChild(seg);
      used += b.time;
    });
    if (n - used > 0) {
      const idle = document.createElement("div");
      idle.className = "idle";
      idle.style.flex = String(n - used);
      idle.textContent = "earning";
      bar.appendChild(idle);
    }
    box.appendChild(bar);

    const cap = document.createElement("p");
    cap.className = "caption";
    cap.textContent = `Build time used: ${used} of ${n} units.`;
    box.appendChild(cap);
    return box;
  }

  function run() {
    const err = document.getElementById("error");
    const out = document.getElementById("solutions");
    err.textContent = "";
    const raw = document.getElementById("input").value.trim();
    const n = Number(raw);
    if (raw === "" || !Number.isInteger(n) || n < 1) {
      err.textContent = "Enter a whole number of 1 or more.";
      return;
    }
    if (n > 5000) {
      err.textContent = "Keep the time units at 5000 or below.";
      return;
    }
    const { earnings, solutions } = maxProfit(n);
    document.getElementById("earnings").textContent = money(earnings);
    out.replaceChildren(...solutions.map((s, i) => renderSolution(s, n, i)));
  }

  document.getElementById("form").addEventListener("submit", e => { e.preventDefault(); run(); });
  run();