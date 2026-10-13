// Generates HTML sources for the templated images into blog/src/generated/:
//   - section banners (sec-*)
//   - project cards (project-*)
//   - terminal screenshots built from real command output in blog/captures/ (term-*)
//   - code screenshots read straight from the project files (code-*)
// render.sh then turns every HTML file into a PNG.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const BLOG = join(SRC, "..");
const REPO = join(BLOG, "..");
const OUT = join(SRC, "generated");
const CAP = join(BLOG, "captures");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const read = (p) => readFileSync(p, "utf8").replace(/\r/g, "").replace(/\n+$/, "");
const cap = (name) => read(join(CAP, name));
const repo = (p) => read(join(REPO, p));
// strip ANSI color codes left in captured logs
const noAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, "").replace(/\[\d+m/g, "");

function page(name, w, h, css, body) {
  writeFileSync(
    join(OUT, `${name}.html`),
    `<!doctype html><html><head><meta charset="utf-8"><meta name="shot" content="${w}x${h}">
<link rel="stylesheet" href="../style.css"><style>body{width:${w}px;height:${h}px}${css}</style></head>
<body>${body}</body></html>`
  );
}

/* ---------------------------------------------------------------- section banners */
const SECTIONS = [
  ["sec-1-why", "01", "Why Docker?", "The problems Docker solves — and why every team uses it", "🤔", "#1d63ed"],
  ["sec-2-concepts", "02", "Core Concepts", "Images, containers, volumes &amp; networks + basic commands", "🧱", "#7a5af8"],
  ["sec-3-workflow", "03", "How Docker Works", "Docker client → Docker host (daemon) → Registry", "🔄", "#0ba5a5"],
  ["sec-4-dockerfile", "04", "The Dockerfile", "FROM · WORKDIR · COPY · RUN · EXPOSE · ENV · ARG · VOLUME · CMD", "📄", "#ff7a45"],
  ["sec-5-handson", "05", "Hands-on: Docker Only", "Project 1 &amp; 2 — build images and run containers step by step", "🛠️", "#12b76a"],
  ["sec-6-compose", "06", "Docker Compose &amp; Watch", "One file for your whole app — sync, rebuild &amp; restart automatically", "🐙", "#1d63ed"],
  ["sec-7-practice", "07", "Hands-on: Compose", "Project 3 &amp; 4 — from a React app to a full MERN stack", "🚀", "#ff5c8a"],
  ["sec-8-cheatsheet", "08", "Cheat Sheet &amp; Wrap-up", "Every command you need, grouped by image, container, volume &amp; network", "📋", "#f5b70a"],
];
for (const [name, num, title, sub, icon, color] of SECTIONS) {
  page(
    name, 1400, 320,
    `.sb{position:relative;height:320px;overflow:hidden;background:linear-gradient(110deg,#081a40 0%,#0d2a66 60%,${color} 160%);display:flex;align-items:center;padding:0 76px;gap:40px}
     .sb .dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.5px);background-size:28px 28px}
     .sb .num{font-size:150px;font-weight:800;color:transparent;-webkit-text-stroke:3px ${color};line-height:1;letter-spacing:-.04em;z-index:1}
     .sb .t{z-index:1}.sb .k{color:${color};font-weight:800;letter-spacing:.16em;font-size:17px;text-transform:uppercase;filter:brightness(1.35)}
     .sb h1{color:#fff;font-size:62px;font-weight:800;letter-spacing:-.03em;line-height:1.05;margin-top:6px}
     .sb p{color:#b9c9e8;font-size:23px;margin-top:12px;font-weight:500}
     .sb .ic{position:absolute;right:70px;font-size:150px;opacity:.95;z-index:1}`,
    `<div class="sb"><div class="dots"></div><div class="num">${num}</div><div class="t"><div class="k">Docker One Shot · Part ${num}</div><h1>${title}</h1><p>${sub}</p></div><div class="ic">${icon}</div></div>`
  );
}

/* ---------------------------------------------------------------- project cards */
const PROJECTS = [
  {
    name: "project-1-hello-docker", n: 1, title: "hello-docker", color: "#12b76a", icon: "👋",
    stack: ["Node.js 22", "Alpine"], level: "Beginner",
    learn: ["Write your first Dockerfile", "docker build &amp; docker run", "Change versions with --build-arg"],
  },
  {
    name: "project-2-react-docker", n: 2, title: "react-docker", color: "#1d63ed", icon: "⚛️",
    stack: ["React 19", "Vite", "TypeScript"], level: "Beginner",
    learn: ["Port mapping with -p", "Live reload with volumes", "Non-root user &amp; layer cache"],
  },
  {
    name: "project-3-react-docker-compose", n: 3, title: "react-docker-compose", color: "#7a5af8", icon: "🐙",
    stack: ["React 19", "Vite", "Docker Compose"], level: "Intermediate",
    learn: ["Turn docker run into compose.yaml", "docker compose up / down", "Logs, ps &amp; background mode"],
  },
  {
    name: "project-4-mern-docker", n: 4, title: "mern-docker", color: "#ff7a45", icon: "🚀",
    stack: ["MongoDB", "Express", "React", "Node.js"], level: "Full-stack",
    learn: ["3 services talking over a network", "Named volume for database data", "docker compose watch"],
  },
];
for (const p of PROJECTS) {
  page(
    p.name, 1400, 400,
    `.pc{height:400px;padding:56px 64px;display:grid;grid-template-columns:1fr 430px;gap:40px;background:#fff;position:relative;overflow:hidden}
     .pc::before{content:"";position:absolute;left:0;top:0;bottom:0;width:14px;background:${p.color}}
     .pc .k{font-weight:800;letter-spacing:.16em;font-size:17px;color:${p.color};text-transform:uppercase}
     .pc h1{font-family:var(--mono);font-size:58px;font-weight:700;color:var(--navy);margin-top:8px;letter-spacing:-.02em}
     .pc .stack{display:flex;gap:10px;margin-top:18px;flex-wrap:wrap}
     .pc .stack span{background:var(--bg);border:2px solid var(--line);border-radius:10px;padding:7px 14px;font-weight:700;font-size:17px;color:var(--navy)}
     .pc .clone{margin-top:30px;background:#0d1526;color:#d6e1f5;border-radius:14px;padding:18px 22px;font-family:var(--mono);font-size:17px;line-height:1.7}
     .pc .clone b{color:#4ade80}
     .pc .side{background:var(--bg);border-radius:22px;padding:28px;display:flex;flex-direction:column;gap:14px;position:relative}
     .pc .big{position:absolute;right:22px;top:14px;font-size:80px}
     .pc .side h3{font-size:21px;font-weight:800;color:var(--navy)}
     .pc .side li{list-style:none;font-size:19px;color:var(--ink);display:flex;gap:10px;line-height:1.4}
     .pc .side li::before{content:"✓";color:${p.color};font-weight:800}
     .pc .lvl{align-self:flex-start;background:${p.color};color:#fff;font-weight:800;border-radius:8px;padding:5px 12px;font-size:15px}`,
    `<div class="pc"><div><div class="k">Project ${p.n} of 4</div><h1>${p.title}</h1>
       <div class="stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
       <div class="clone"><b>$</b> git clone https://github.com/Tanvirulislam345/docker-course.git<br><b>$</b> cd docker-course/${p.title}</div></div>
     <div class="side"><div class="big">${p.icon}</div><div class="lvl">${p.level}</div><h3>What you'll learn</h3><ul style="display:flex;flex-direction:column;gap:12px">${p.learn.map((l) => `<li>${l}</li>`).join("")}</ul></div></div>`
  );
}

/* ---------------------------------------------------------------- terminal screenshots */
function colorTerm(line) {
  if (line.startsWith("$ ")) return `<span class="t-prompt">$</span> <span class="t-cmd">${esc(line.slice(2))}</span>`;
  if (line.startsWith("# ")) return `<span class="t-note">${esc(line)}</span>`;
  if (/^\s*\.\.\.$/.test(line)) return `<span class="t-dim">${esc(line)}</span>`;
  if (/error|Error|refused|❌/.test(line)) return `<span class="t-err">${esc(line)}</span>`;
  if (/WARNING/.test(line)) return `<span class="t-warn">${esc(line)}</span>`;
  if (/➜|VITE v/.test(line)) return `<span class="t-info">${esc(line)}</span>`;
  if (/✅|Started|Successfully|Hello, Docker!|Syncing|Watch enabled|Built|server listening|hmr update|naming to/.test(line))
    return `<span class="t-ok">${esc(line)}</span>`;
  if (/^#\d+ /.test(line)) return `<span class="t-dim">${esc(line)}</span>`;
  return esc(line);
}

function terminal(name, { label, title = "bash", lines, font = 18, width = 1400 }) {
  const lh = Math.round(font * 1.56);
  const maxChars = Math.floor((width - 80 - 52) / (font * 0.6));
  const body = lines
    .map((l) => (l.length > maxChars ? l.slice(0, maxChars - 1) + "…" : l))
    .map(colorTerm)
    .join("\n");
  const h = lines.length * lh + 44 + 48 + 80 + (label ? 50 : 0) + 40;
  page(
    name, width, h,
    `.wrap{padding:40px}.lbl{font-weight:800;font-size:19px;color:var(--navy);margin-bottom:16px;display:flex;gap:10px;align-items:center}
     .lbl span{background:var(--blue);color:#fff;border-radius:8px;padding:3px 10px;font-size:15px;letter-spacing:.06em}
     .window pre{font-size:${font}px;line-height:${lh}px}`,
    `<div class="wrap">${label ? `<div class="lbl">${label}</div>` : ""}<div class="window"><div class="bar"><span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span><span class="dot" style="background:#28c840"></span><span class="name">${esc(title)}</span></div><pre>${body}</pre></div></div>`
  );
}

const L = (s) => noAnsi(s).split("\n");
const tag = (t) => `<span>${t}</span>`;

// hello-docker: keep the build steps from the real BuildKit output
const helloBuild = L(cap("hello-build.txt")).filter(
  (l) => l.startsWith("$") || /^#\d+ \[\d\/\d\]/.test(l) || /naming to .* done/.test(l)
).map((l) => l.replace(/@sha256:\w+/, ""));
terminal("term-01-hello-build", { label: `${tag("PROJECT 1")} Build the image`, title: "hello-docker", lines: helloBuild, font: 16 });
terminal("term-02-hello-run", {
  label: `${tag("PROJECT 1")} Run the container`, title: "hello-docker",
  lines: [...L(cap("hello-run.txt")), "", ...L(cap("hello-images.txt")).filter((l) => !l.startsWith("WARNING"))],
});

terminal("term-03-react-noport", {
  label: `${tag("STEP 2")} Running without -p: the app starts…`, title: "react-docker",
  lines: [...L(cap("react-run-noport.txt")).filter((l) => l.trim() !== ""), "", "# …but from your computer the browser can't reach it:", ...L(cap("react-curl-noport.txt"))],
});
terminal("term-04-react-ps", {
  label: `${tag("STEP 3–4")} With -p 5173:5173 and -d --name react-app`, title: "react-docker", font: 16,
  lines: ["$ docker run -d -p 5173:5173 --name react-app react-docker", "2eebe179ab91…", "", ...L(cap("react-ps.txt")), "", ...L(cap("react-logs.txt")).filter((l) => l.trim() !== "")],
});
const broken = L(cap("react-vol-broken.txt"));
terminal("term-05-react-vol-broken", {
  label: `${tag("STEP 5")} Only the code volume → crash`, title: "react-docker", font: 16,
  lines: [...broken.slice(0, 4).filter((l) => l.trim() !== ""), "", broken.find((l) => l.startsWith("Error: Cannot find native binding")), "    ...", broken.find((l) => l.includes("Cannot find module '@rolldown/binding-linux-x64-musl'")).trim(), "", "Node.js v22.21.1"],
});
terminal("term-06-react-vol-ok", {
  label: `${tag("STEP 6–7")} Add -v /app/node_modules → works, and edits reload live`, title: "react-docker", font: 16,
  lines: [...L(cap("react-vol-ok.txt")).filter((l) => l.trim() !== ""), "", "# you edit src/App.tsx on your computer and save…", L(cap("react-hmr.txt")).find((l) => l.includes("hmr update")).trim()],
});

// react-docker-compose
const rdcUp = L(cap("rdc-up-raw.txt")).filter((l) => /^\$|^ (Image|Network|Container) .* (Built|Created|Started)/.test(l));
terminal("term-07-rdc-up", { label: `${tag("PROJECT 3")} docker compose up -d --build`, title: "react-docker-compose", lines: rdcUp });
terminal("term-08-rdc-ps-logs", {
  label: `${tag("PROJECT 3")} Check status and logs`, title: "react-docker-compose", font: 15,
  lines: [...L(cap("rdc-ps.txt")), "", ...L(cap("rdc-logs.txt")).filter((l) => l.replace("web-1  |", "").trim() !== "")],
});
terminal("term-09-rdc-down", { label: `${tag("PROJECT 3")} Stop and clean up`, title: "react-docker-compose", lines: L(cap("rdc-down.txt")) });

// mern-docker
const mernUp = ["$ docker compose up -d --build", ...L(cap("mern-up-raw.txt")).filter((l) => /^ (Image|Network|Volume|Container) .* (Built|Created|Started)/.test(l))];
terminal("term-10-mern-up", { label: `${tag("PROJECT 4")} Start the whole stack`, title: "mern-docker", lines: mernUp });
terminal("term-11-mern-ps-logs", {
  label: `${tag("PROJECT 4")} Three containers, and the API is connected`, title: "mern-docker", font: 16,
  lines: [...L(cap("mern-ps.txt")), "", ...L(cap("mern-logs-api.txt")).filter((l) => l.replace("api-1  |", "").trim() !== "")],
});
terminal("term-12-mern-curl", { label: `${tag("PROJECT 4")} Talk to the API`, title: "mern-docker", font: 15, lines: L(cap("mern-curl.txt")) });
terminal("term-13-mern-persist", { label: `${tag("PROJECT 4")} Does the data survive?`, title: "mern-docker", font: 17, lines: L(cap("mern-persist.txt")) });
const watch = L(cap("mern-watch-raw.txt")).filter((l) => /Watch enabled|Syncing|Container .* Started/.test(l));
terminal("term-14-mern-watch", {
  label: `${tag("PROJECT 4")} docker compose watch`, title: "mern-docker",
  lines: ["$ docker compose watch", ...watch.slice(0, -1), "# you edit backend/index.js and save…", watch[watch.length - 1],
    "", "$ curl http://localhost:8000/", "Hello from Docker Compose Watch!"],
});

// core concepts
terminal("term-15-containers", { label: `${tag("CONTAINERS")} Run, list, stop and remove (one or many)`, title: "bash", font: 16, lines: L(cap("concept-containers.txt")) });
terminal("term-16-volumes", { label: `${tag("VOLUMES")} Create, list and remove`, title: "bash", lines: L(cap("concept-volumes.txt")) });
terminal("term-17-network", {
  label: `${tag("NETWORKS")} Containers on the same network find each other by name`, title: "bash", font: 17,
  lines: L(cap("concept-network.txt")).filter((l) => !/Pulling|Download|Pull complete|Digest|Status|Unable to find|latest: Pulling/.test(l)),
});
terminal("term-18-images", { label: `${tag("IMAGES")} Images on this machine after the course`, title: "bash", lines: L(cap("concept-images.txt")) });

/* ---------------------------------------------------------------- code screenshots */
function hlDocker(line) {
  if (/^\s*#/.test(line)) return `<span class="cm">${esc(line)}</span>`;
  let h = esc(line)
    .replace(/(&quot;|")([^"]*)(")/g, '<span class="s">"$2"</span>')
    .replace(/(\$\{[A-Z_]+\})/g, '<span class="v">$1</span>');
  return h.replace(/^([A-Z]+)(\s)/, '<span class="k">$1</span>$2');
}
function hlYaml(line) {
  const m = line.match(/^(\s*)(#.*)$/);
  if (m) return `${m[1]}<span class="cm">${esc(m[2])}</span>`;
  let [code, ...rest] = line.split(/(?<=\s)#/);
  let h = esc(code).replace(/^(\s*-?\s*)([\w.-]+):/, '$1<span class="n">$2:</span>');
  h = h.replace(/^(\s*-\s+)(?!<span)(.+)$/, '$1<span class="s">$2</span>');
  return h + (rest.length ? `<span class="cm">#${esc(rest.join("#"))}</span>` : "");
}
function hlJson(line) {
  return esc(line).replace(/"([^"]+)":/g, '<span class="n">"$1"</span>:').replace(/: "([^"]*)"/g, ': <span class="s">"$1"</span>');
}
function hlJs(line) {
  if (/^\s*\/\//.test(line)) return `<span class="cm">${esc(line)}</span>`;
  let h = esc(line).replace(/'([^']*)'/g, `<span class="s">'$1'</span>`);
  h = h.replace(/\/\/(.*)$/, '<span class="cm">//$1</span>');
  return h.replace(/\b(import|export|default|from|true)\b/g, '<span class="k">$1</span>');
}

function codeShot(name, { label, file, lines, hl, highlight = [], font = 17, width = 1400, notes }) {
  const lh = Math.round(font * 1.6);
  const body = lines
    .map((l, i) => {
      const inner = `<span class="ln">${i + 1}</span>${hl(l)}`;
      return highlight.some((m) => (typeof m === "number" ? m === i + 1 : l.includes(m))) ? `<span class="hl">${inner}</span>` : inner;
    })
    .join("\n");
  const notesH = notes ? Math.ceil(notes.length / 2) * 70 + 30 : 0;
  const h = lines.length * lh + 44 + 48 + 80 + (label ? 50 : 0) + notesH + 40;
  page(
    name, width, h,
    `.wrap{padding:40px}.lbl{font-weight:800;font-size:19px;color:var(--navy);margin-bottom:16px;display:flex;gap:10px;align-items:center}
     .lbl span{background:var(--orange);color:#fff;border-radius:8px;padding:3px 10px;font-size:15px;letter-spacing:.06em}
     .window pre{font-size:${font}px;line-height:${lh}px}
     .notes{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}
     .notes div{background:#fff;border:2px solid var(--line);border-radius:12px;padding:10px 14px;font-size:16px;color:var(--muted);line-height:1.4}
     .notes b{font-family:var(--mono);color:var(--navy)}`,
    `<div class="wrap">${label ? `<div class="lbl">${label}</div>` : ""}<div class="window"><div class="bar"><span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span><span class="dot" style="background:#28c840"></span><span class="name">${esc(file)}</span></div><pre>${body}</pre></div>
     ${notes ? `<div class="notes">${notes.map((n) => `<div>${n}</div>`).join("")}</div>` : ""}</div>`
  );
}

const stripHashComments = (src) => src.split("\n").filter((l) => !/^\s*#/.test(l) && l.trim() !== "");
const ctag = (t) => `<span>${t}</span>`;

codeShot("code-01-hello-dockerfile", {
  label: `${ctag("PROJECT 1")} hello-docker/Dockerfile`, file: "hello-docker/Dockerfile",
  lines: repo("hello-docker/Dockerfile").split("\n"), hl: hlDocker, font: 22,
  notes: ["<b>ARG</b> default Node version, changeable at build time", "<b>FROM</b> start from a tiny Alpine + Node image",
    "<b>WORKDIR</b> work inside /app", "<b>COPY . .</b> copy app.js into the image", "<b>CMD</b> run node app.js on start"],
});
codeShot("code-02-hello-app", {
  label: `${ctag("PROJECT 1")} hello-docker/app.js`, file: "hello-docker/app.js",
  lines: repo("hello-docker/app.js").split("\n"), hl: hlJs, font: 22,
});
codeShot("code-03-react-dockerfile", {
  label: `${ctag("PROJECT 2")} react-docker/Dockerfile (comments removed — see the repo for the fully commented version)`,
  file: "react-docker/Dockerfile", lines: stripHashComments(repo("react-docker/Dockerfile")), hl: hlDocker, font: 19,
  highlight: ["COPY package*.json", "RUN npm install"],
});
const pkg = repo("react-docker/package.json").split("\n");
codeShot("code-04-package-host", {
  label: `${ctag("IMPORTANT")} Add --host to the dev script`, file: "react-docker/package.json",
  lines: pkg.slice(0, pkg.findIndex((l) => l.includes('"dependencies"'))), hl: hlJson, font: 21, highlight: ["--host"],
});
codeShot("code-05-rdc-compose", {
  label: `${ctag("PROJECT 3")} react-docker-compose/compose.yaml`, file: "react-docker-compose/compose.yaml",
  lines: repo("react-docker-compose/compose.yaml").split("\n"), hl: hlYaml, font: 22,
});
codeShot("code-06-mern-compose", {
  label: `${ctag("PROJECT 4")} mern-docker/compose.yaml (comments removed)`, file: "mern-docker/compose.yaml",
  lines: stripHashComments(repo("mern-docker/compose.yaml")), hl: hlYaml, font: 16.5,
  highlight: ["develop:", "watch:", "action:", "target:", "- path:"],
});
codeShot("code-07-mern-vite", {
  label: `${ctag("PROJECT 4")} frontend/vite.config.js`, file: "mern-docker/frontend/vite.config.js",
  lines: repo("mern-docker/frontend/vite.config.js").split("\n"), hl: hlJs, font: 20, highlight: ["host: true", "usePolling"],
});
codeShot("code-08-mern-backend-dockerfile", {
  label: `${ctag("PROJECT 4")} backend/Dockerfile (comments removed)`, file: "mern-docker/backend/Dockerfile",
  lines: stripHashComments(repo("mern-docker/backend/Dockerfile")), hl: hlDocker, font: 19, highlight: ["npm ci", "EXPOSE 8000"],
});

console.log("generated HTML sources in blog/src/generated/");
