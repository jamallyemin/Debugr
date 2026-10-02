const Theme = (() => {
    const STORAGE_KEY = "vg_theme_overrides";
    const VARS = ["--bg", "--bg2", "--bg3", "--border", "--text", "--text-dim", "--green", "--red", "--amber"];

    const PRESETS = [
        {
            name: "CLASSIC",
            vars: {
        "--bg": "#0d0d0d", "--bg2": "#111111", "--bg3": "#161616", "--border": "#2a2a2a",
        "--text": "#d8d8d8", "--text-dim": "#666666", "--green": "#4caf72", "--red": "#c0443a", "--amber": "#c89b3c",
            },
        },
        {
            name: "AMBER MONO",
            vars: {
        "--bg": "#0d0a03", "--bg2": "#161006", "--bg3": "#1e1608", "--border": "#3a2c10",
        "--text": "#e8c878", "--text-dim": "#8a6c30", "--green": "#c89b3c", "--red": "#b5651d", "--amber": "#f0b429",                
            },
        },
        {
            name: "COLD SIGNAL",
            vars: {
        "--bg": "#0a0e12", "--bg2": "#0f151a", "--bg3": "#141c22", "--border": "#22323c",
        "--text": "#cfe3ec", "--text-dim": "#5c7a88", "--green": "#4ac0b0", "--red": "#c0596a", "--amber": "#4fa3c8",                
            },
        },
    ];

    function applyVars(vars) {
        for (const key of VARS) {
            if (vars[key]) document.documentElement.style.setProperty(key, vars[key]);
        }
    }
    function load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        try {return JSON.parse(raw); } catch {return null;}
    }
    function save(vars) {localStorage.setItem(STORAGE_KEY, JSON.stringify(vars)); }

    function currentVars() {
        const cs = getComputedStyle(document.documentElement);
        const out = {};
        for (const key of VARS) out[key] =cs.getPropertyValue(key).trim();
        return out;
    }

    function toHex(color) {
        if (!color) return "#000000";
        if (color.startsWith("#")) {
            return color.length === 4 ? "#" + [...color.slice(1)].map((c) => c + c).join("") : color;
        }
        const m = color.match(/\d+/g);
        if (!m) return "#000000"
        return "#" + m.slice(0, 3).map((n) => (+n).toString(16).padStart(2, "0")).join("");
    }
    function renderPresets() {
        const wrap = document.getElementById("theme-presets");
        wrap.innerHTML = PRESETS.map((p) =>`<button class="btn small theme-preset-btn" data-preset="${p.name}">${p.name}</button>`).join("");
        wrap.querySelectorAll(".theme-preset-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const preset = PRESETS.find((p) => p.name === btn.dataset.preset);
                applyVars(preset.vars);
                save(preset.vars);
                renderSwatches();
            });
        });
    }
    function renderSwatches() {
        const wrap = document.getElementById("theme-swatches");
        const current = currentVars();
    const labels = { "--bg": "Background", "--amber": "Accent", "--green": "Pass (true)", "--red": "Fail (false)", "--text": "Text" };
    const keys = ["--bg", "--amber", "--green", "--red", "--text"];
    wrap.innerHTML = keys
      .map((k) => `
      <label class="theme-swatch">
        <span>${labels[k]}</span>
        <input type="color" data-var="${k}" value="${toHex(current[k])}" />
      </label>`)
      .join("");
    wrap.querySelectorAll("input[type=color]").forEach((input) => {
        input.addEventListener("input", () => {
            document.documentElement.style.setProperty(input.dataset.var, input.value); 
        save(currentVars());
    });
    });
    }

    function reset() {
        localStorage.removeItem(STORAGE_KEY);
        applyVars(PRESETS[0].vars);
        renderSwatches();
    }

    function init() {
        const saved = load();
        if (saved) applyVars(saved);
    }


  document.getElementById("theme-btn").addEventListener("click", () => {
    renderPresets();
    renderSwatches();
    document.getElementById("theme-prompt").classList.remove("hidden");
  });
  document.getElementById("theme-close-btn").addEventListener("click", () => {
    document.getElementById("theme-prompt").classList.add("hidden");
  });
  document.getElementById("theme-reset-btn").addEventListener("click", reset);
 
  init();
  return {};
})();
