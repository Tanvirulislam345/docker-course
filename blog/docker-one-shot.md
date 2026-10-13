# Docker One Shot: Learn Docker from Zero to Full-Stack

### Understand images, containers, volumes, networks, the Dockerfile and Docker Compose — then practice on four real projects, from a one-line Node app to a full MERN stack.

![Docker One Shot](images/00-banner.png)

You clone a project, follow the README, and still lose an afternoon to "wrong Node version" or "MongoDB isn't installed". Docker exists to end that.

This guide takes you from zero to running a full-stack app in containers. First you learn the ideas in plain words. Then you build four projects, one step at a time. No Docker experience needed — if you can run `npm install`, you can follow along.

All the code is in one repo: **https://github.com/Tanvirulislam345/docker-course**

## Table of Contents

1. Why Docker?
2. Core concepts: image, container, volume, network
3. How Docker works: client, daemon and registry
4. The Dockerfile
5. Project 1 — hello-docker
6. Project 2 — react-docker, step by step
7. Docker Compose and Compose Watch
8. Project 3 — react-docker-compose
9. Project 4 — mern-docker (full stack)
10. Troubleshooting
11. Cheat sheet and what's next

**Before you start**, install [Docker Desktop](https://docs.docker.com/get-docker/) (Windows/Mac) or Docker Engine (Linux), and [Git](https://git-scm.com/). Docker Compose comes with Docker. Check both:

```bash
docker --version
docker compose version
```

---

## 1. Why Docker?

Picture three developers on one project. You have Node 22 and MongoDB 7 on Ubuntu — the app works. Your teammate has Node 18 on Windows — it crashes. The server has Node 20 and no MongoDB — deployment fails. The code is identical. The **environment** is not.

Docker's answer: don't ship only your code. Ship your code **together with everything it needs** — the right Node version, the packages, the settings. That bundle is called an **image**, and it runs the same on any machine that has Docker.

![Why Docker](images/01-why-docker.png)

### The problems Docker solves

- **Consistency across environments.** Development, testing and production run the same image. "Works on my machine" becomes "works on every machine".
- **Isolation.** Each app lives in its own container with its own files, packages and ports. A project on Node 18 and another on Node 24 can run side by side.
- **Portability.** Build once, run on Linux, macOS, Windows or any cloud.
- **Scalability.** More traffic? Start more copies of the same container in seconds.
- **Version control.** The Dockerfile lives in Git next to your code, and images carry tags like `my-app:1.2`. A bad release? Run `my-app:1.1` again.
- **DevOps integration.** CI/CD pipelines build the image, test it, push it to a registry, and servers pull it. It's the standard unit of deployment.
- **Faster onboarding.** A new teammate runs one command instead of following a ten-step setup guide.
- **Try tools without installing them.** Need MongoDB, Redis or PostgreSQL for an afternoon? Run it in a container and delete it afterwards — nothing is left on your system.

…and many more: reproducible bug reports, clean uninstalls, matching production locally, and so on.

### Containers are not virtual machines

A virtual machine carries a whole operating system, so it is gigabytes in size and takes minutes to boot. A container shares the host's OS kernel and packs only your app and its libraries — megabytes in size, starting in about a second.

![VM vs container](images/02-vm-vs-container.png)

---

## 2. Core concepts: image, container, volume, network

Four words cover most of Docker. Here's how they fit together — keep this picture in mind for the rest of the guide:

![The Docker big picture](images/03-docker-big-picture.png)

### Image

An **image** is a read-only package: an operating system base, a runtime like Node.js, your code and its libraries, plus the command to start it. You either **build** one from a Dockerfile or **pull** a ready-made one from Docker Hub.

If you're a developer: an image is like a **class**, and a container is an **object** created from it.

```bash
# download images from Docker Hub
docker pull ubuntu
docker pull node:22-alpine

# list the images on your machine
docker images

# remove one image
docker rmi ubuntu

# remove several images at once
docker rmi ubuntu node:22-alpine

# remove every image that no container uses
docker image prune -a
```

`node:22-alpine` means: image `node`, tag `22-alpine` (Node 22 on Alpine, a tiny Linux). Without a tag, Docker uses `latest`.

### Container

A **container** is a **running copy of an image**. You can start many containers from one image, and each is isolated from the others. Deleting a container doesn't delete its image.

Try it — start a tiny Ubuntu computer and step inside:

```bash
docker run -it --name my-ubuntu ubuntu
```

- `-it` gives you an interactive terminal.
- `--name my-ubuntu` names the container so you don't need its ID.

You're now inside Ubuntu, even if your computer runs Windows or macOS:

```bash
cat /etc/os-release
exit
```

```
PRETTY_NAME="Ubuntu 26.04.1 LTS"
NAME="Ubuntu"
```

After `exit` the container stops, but it still exists:

```bash
docker ps          # running containers only — my-ubuntu isn't listed
docker ps -a       # all containers, including stopped ones
```

```
NAMES       IMAGE     STATUS
my-ubuntu   ubuntu    Exited (0) 5 seconds ago
```

Start it again, then remove it:

```bash
docker start -ai my-ubuntu   # start and attach to it again
docker rm my-ubuntu          # remove it (it must be stopped)
```

Working with several containers at once:

```bash
# start two containers in the background (-d); "sleep infinity" just keeps them running
docker run -d --name ubuntu1 ubuntu sleep infinity
docker run -d --name ubuntu2 ubuntu sleep infinity

# stop and remove both in one command
docker stop ubuntu1 ubuntu2
docker rm ubuntu1 ubuntu2

# remove ALL containers, running or not
docker rm -f $(docker ps -aq)
```

### Volume

Anything a container writes inside itself is **lost when the container is deleted** — a disaster for a database. A **volume** is storage that lives **outside** the container, so the data survives.

```bash
docker volume create my-data        # create
docker volume ls                    # list
docker volume inspect my-data       # details
docker volume rm my-data            # remove one
docker volume rm my-data logs-data  # remove several
docker volume prune -a              # remove all unused volumes
```

See it work. One container writes a file into the volume and is deleted (`--rm`). A brand-new container still reads the file:

```bash
docker volume create my-data
docker run --rm -v my-data:/data ubuntu bash -c 'echo "Hello from a volume" > /data/note.txt'
docker run --rm -v my-data:/data ubuntu cat /data/note.txt
```

```
Hello from a volume
```

`-v my-data:/data` means: mount the volume `my-data` at the folder `/data` inside the container.

### Network

Containers are isolated, so how does an API reach its database? Put them on the same **network** — then they can find each other **by name**.

```bash
docker network create my-net
docker network ls

# a container named "server" on my-net
docker run -d --name server --network my-net node:22-alpine sleep infinity

# a second container pings it by name
docker run --rm --network my-net node:22-alpine ping -c 2 server
```

```
PING server (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.086 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.141 ms
```

Docker turned the name `server` into the container's IP address. Clean up:

```bash
docker rm -f server
docker network rm my-net
```

You'll rarely create networks by hand: Docker Compose does it for you, as you'll see in Project 4.

---

## 3. How Docker works: client, daemon and registry

Look at the big picture above once more. Three parts work together:

- **Docker client** — the `docker` command you type. It does no heavy lifting; it only sends your request to the daemon.
- **Docker host and daemon** — the host is your laptop or server. The **daemon** (`dockerd`) running on it does the real work: builds images, creates and runs containers, manages volumes and networks. Docker Desktop starts it for you.
- **Registry** — a library of images. **Docker Hub** is the default; GitHub Container Registry and AWS ECR are others. `docker pull` downloads from it, `docker push` uploads to it.

So when you type `docker run node:22-alpine`:

1. The client sends the command to the daemon.
2. The daemon checks whether `node:22-alpine` is already on your machine.
3. If not, it pulls the image from Docker Hub.
4. It creates a container from the image and starts it.

That's the whole Docker workflow: **build → push / pull → run**.

---

## 4. The Dockerfile

A **Dockerfile** is a text file (named exactly `Dockerfile`) with step-by-step instructions to build an image. Think of it as the recipe.

**FROM** — the base image to start from. Always the first instruction.

```dockerfile
FROM node:22-alpine
```

**WORKDIR** — the folder inside the image where the next instructions run. Creates it if needed, like `mkdir` + `cd`.

```dockerfile
WORKDIR /app
```

**COPY** — copy files from your project into the image.

```dockerfile
COPY package*.json ./
COPY . .
```

**RUN** — run a command **while building** the image, usually to install something.

```dockerfile
RUN npm install
```

**EXPOSE** — documents which port the app listens on. It does **not** publish the port; you still need `-p` when you run the container.

```dockerfile
EXPOSE 5173
```

**ENV** — an environment variable your app can read **while it runs**.

```dockerfile
ENV PORT=8000
```

**ARG** — a variable that exists **only during the build**. Override it with `--build-arg`.

```dockerfile
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-alpine
```

**VOLUME** — marks a folder whose data should live in a volume.

```dockerfile
VOLUME /data/db
```

**CMD** — the command that runs **when a container starts**. Only the last `CMD` counts.

```dockerfile
CMD ["npm", "run", "dev"]
```

**USER** — which user runs the next steps and the app. Our React and MERN Dockerfiles use it so the app doesn't run as `root` (safer if the app is ever hacked).

Two pairs that often confuse beginners:

- **RUN vs CMD:** `RUN npm install` happens once, during the build. `CMD npm run dev` happens every time a container starts.
- **ARG vs ENV:** `ARG` disappears after the build. `ENV` is still there when the app runs.

### How a Dockerfile becomes an image (and why order matters)

Each instruction adds a **layer** to the image. Docker caches layers, and on a rebuild it reuses every layer up to the first one that changed. That's why good Dockerfiles copy `package.json` and install dependencies **before** copying the rest of the code:

![Dockerfile to container](images/04-dockerfile-to-container.png)

### .dockerignore

Like `.gitignore`, but for builds: it keeps files out of the image. Our React projects ignore `node_modules/`, because your local packages are built for your OS while the image needs packages built for Linux — so `npm install` runs inside the image instead.

```
node_modules/
```

---

## 5. Project 1 — hello-docker

The smallest possible app: Node.js prints one line.

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/hello-docker
```

`app.js`:

```js
console.log("Hello, Docker!");
```

`Dockerfile`:

```dockerfile
ARG NODE_VERSION=22.21.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY . .

CMD ["node", "app.js"]
```

- `ARG NODE_VERSION=22.21.1` — the default Node version, changeable at build time.
- `FROM node:${NODE_VERSION}-alpine` — start from the official Node image on Alpine Linux.
- `WORKDIR /app` — work inside `/app`.
- `COPY . .` — copy the project (`app.js`) into `/app`.
- `CMD ["node", "app.js"]` — run the app when the container starts.

**Build the image:**

```bash
docker build -t hello-docker .
```

`-t hello-docker` names (tags) the image. The final `.` is the **build context**: the folder Docker sends to the build, where it also finds the Dockerfile.

**Run it:**

```bash
docker run --rm hello-docker
```

```
Hello, Docker!
```

`--rm` deletes the container as soon as it stops. This app prints one line and exits, so there's nothing to keep.

That's your first container — and notice you didn't need Node.js installed. It came inside the image.

**Try another Node version** without touching the Dockerfile, thanks to `ARG`:

```bash
docker build --build-arg NODE_VERSION=20 -t hello-docker .
docker run --rm hello-docker
```

**Clean up:**

```bash
docker rmi hello-docker
```

---

## 6. Project 2 — react-docker, step by step

A real frontend now: React 19 + TypeScript + Vite. This is a web server, so you'll meet **ports** and **volumes**.

```bash
cd ../react-docker
```

### Important: add `--host` to the dev script

Open `package.json` and make sure the `dev` script is `vite --host`:

```json
"scripts": {
  "dev": "vite --host",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

> **Why?** By default Vite only listens on `localhost` **inside the container**. Your browser's requests come from outside the container, so Vite would ignore them and the page would never load. `--host` makes Vite listen on all network interfaces so Docker can forward your requests. In your own projects, change `"dev": "vite"` to `"dev": "vite --host"` (or set `server: { host: true }` in the Vite config). This repo already has it.

### The Dockerfile

The repo version has a comment on every line. Without comments:

```dockerfile
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-alpine

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app
COPY package*.json ./

USER root
RUN chown -R app:app .
USER app

RUN npm install
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]
```

In plain words:

1. Start from Node 22 on Alpine.
2. Create a normal user `app` and switch to it, so the app doesn't run as `root`.
3. Work in `/app` and copy **only** `package.json` and `package-lock.json` first — the cache trick from section 4.
4. `WORKDIR` and `COPY` create files owned by `root`, so the `app` user couldn't write there and `npm install` would fail with `EACCES: permission denied`. Briefly switch to `root`, give `/app` to `app` with `chown`, switch back.
5. Install dependencies inside the image, then copy the rest of the code.
6. Document port 5173 and start the Vite dev server.

Now we run it, adding **one flag at a time** so you see what each one does.

### Step 1 — Build the image

```bash
docker build -t react-docker .
```

The first build runs `npm install` and takes a minute. Later builds reuse the cache.

### Step 2 — Run it

```bash
docker run react-docker
```

Vite says it's ready at `http://localhost:5173` — but open that in your browser and **nothing loads**. The container has its own network; port 5173 is open inside it, but nothing connects it to your computer. Press `Ctrl + C`.

### Step 3 — Map the port with `-p`

```bash
docker run -p 5173:5173 react-docker
```

Open **http://localhost:5173** — the app loads. `-p HOST:CONTAINER` forwards a port on your computer to a port in the container. The right side must match where the app listens (5173). The left side can be any free port: `-p 3000:5173` → http://localhost:3000.

### Step 4 — Run in the background with `-d` and `--name`

```bash
docker run -d -p 5173:5173 --name react-app react-docker
```

`-d` (detached) gives you your terminal back; `--name` gives the container a friendly name. Manage it:

```bash
docker ps                 # is it running?
docker logs react-app     # what did it print?
docker logs -f react-app  # follow logs live (Ctrl + C to exit)
docker stop react-app     # stop it
docker rm react-app       # remove it
```

### Step 5 — Sync your code with `-v`

Edit `src/App.tsx` and refresh the browser: **nothing changes**. Your code was copied into the image at build time, so the container never sees your edits. Rebuilding after every change would be painful.

Mount your project folder into the container instead:

```bash
docker run -p 5173:5173 -v "$(pwd):/app" react-docker
```

`-v "$(pwd):/app"` is a **bind mount**: the current folder appears at `/app` in the container and stays in sync. But the container crashes:

```
Error: Cannot find native binding. ...
  cause: Error: Cannot find module '@rolldown/binding-linux-x64-musl'
```

The mount replaced the **whole** `/app` folder — including `node_modules`. The Linux packages installed in the image are now hidden behind your local folder (built for your OS, or missing if you never ran `npm install`).

### Step 6 — Protect node_modules

```bash
docker run -p 5173:5173 -v "$(pwd):/app" -v /app/node_modules react-docker
```

The second `-v /app/node_modules` is an **anonymous volume**. It tells Docker: for this one folder, keep the container's own copy. Your code syncs; the packages stay.

![Ports and volumes](images/05-ports-and-volumes.png)

> **Windows:** use `${PWD}` in PowerShell or `%cd%` in Command Prompt instead of `$(pwd)`.

### Step 7 — Edit and refresh

Change the "Get started" heading in `src/App.tsx` and save. The browser updates by itself — Vite's hot reload works inside Docker. The logs show:

```
[vite] (client) hmr update /src/App.tsx
```

If your edits don't show up (it happens on some Windows/Mac setups), enable polling in `vite.config.ts`: `server: { watch: { usePolling: true } }`.

### Step 8 — Auto-cleanup with `--rm`

```bash
docker run --rm -d --name react-app -p 5173:5173 \
  -v "$(pwd):/app" -v /app/node_modules react-docker
```

`--rm` deletes the container when it stops, so `docker stop react-app` is all the cleanup you need.

That command works, but look at it: five flags you must remember, type every time and explain in a README. Now imagine a frontend **and** a backend **and** a database. That's what Docker Compose is for.

---

## 7. Docker Compose and Compose Watch

**Docker Compose** describes your containers in one YAML file, `compose.yaml`, and starts them all with one command: `docker compose up`.

What it solves:

- **Long commands** → written once, saved in Git, shared with the team.
- **Many containers** → frontend, backend and database in one file.
- **Networking** → Compose creates a network automatically; services reach each other by service name.
- **Start order** → `depends_on` starts the database before the API, the API before the frontend.
- **One set of commands** → `up`, `down`, `logs`, `ps` act on the whole app.

Every `docker run` flag you learned has a home in `compose.yaml`:

![docker run to compose.yaml](images/06-docker-run-to-compose.png)

The commands you'll use every day:

```bash
docker compose up            # build if needed, create and start everything
docker compose up --build    # rebuild images first
docker compose up -d         # run in the background
docker compose ps            # list this project's containers
docker compose logs -f web   # follow one service's logs
docker compose stop          # stop, keep the containers
docker compose down          # stop and remove containers and network
docker compose down -v       # also delete volumes (deletes database data!)
```

### Compose Watch

Even with Compose, the image holds a **copy** of your code. Change a file and you must run `docker compose up --build` and wait. Bind mounts (Project 2) help, but they share everything — so you need the `node_modules` trick — they can be slow on Mac and Windows, and they never install a package you just added.

**`docker compose watch`** fixes this. In a `develop.watch` section you list which files to watch and what to do when they change:

![Compose Watch](images/07-compose-watch.png)

- **`sync`** — copy changed files into the running container. Use for source code; Vite or nodemon reloads it.
- **`rebuild`** — build a new image and replace the container. Use for `package.json`, the lock file and the Dockerfile.
- **`sync+restart`** — copy the files, then restart the container. Use for config files read only at startup.

Compose Watch needs Docker Compose v2.22 or newer. You'll use it in Project 4.

---

## 8. Project 3 — react-docker-compose

The same React app as Project 2 — same Dockerfile, same `vite --host` dev script — now run with Compose.

```bash
cd ../react-docker-compose
```

`compose.yaml`:

```yaml
services:
  web:
    build:
      context: .
    ports:
      - 5173:5173
    volumes:
      - .:/app
      - /app/node_modules
```

It's the long Project 2 command written as a file:

- `web` — one service (one container).
- `build: context: .` — build from the Dockerfile in this folder, like `docker build .`.
- `ports: - 5173:5173` — like `-p 5173:5173`.
- `volumes: - .:/app` — like `-v "$(pwd):/app"`.
- `volumes: - /app/node_modules` — like `-v /app/node_modules`.

**Start it:**

```bash
docker compose up --build
```

Open **http://localhost:5173** and edit `src/App.tsx` — the page updates live, thanks to the volumes. To run in the background instead, add `-d`:

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f web
```

**Stop and clean up:**

```bash
docker compose down
```

One command removes the container and the network Compose created.

> **Added an npm package and it's "missing" in the container?** The `/app/node_modules` volume still holds the old packages. Run `docker compose down -v`, then `docker compose up --build`.

---

## 9. Project 4 — mern-docker (full stack)

An Anime sharing app built with **MongoDB, Express, React and Node.js**: three containers, one command.

```bash
cd ../mern-docker
```

![MERN architecture](images/08-mern-architecture.png)

- **web** — React + Vite frontend from `./frontend`, port 5173. Home (`/`) lists anime, Share (`/create`) adds one.
- **api** — Express + Mongoose backend from `./backend`, port 8000, with `GET` and `POST` on `/api/anime`.
- **db** — MongoDB from the official `mongo:latest` image, port 27017, data in the named volume `anime`.

### The Dockerfiles

`backend/Dockerfile` and `frontend/Dockerfile` follow the Project 2 pattern, with two differences. They use `npm ci` instead of `npm install`, which installs exactly the versions in `package-lock.json` — faster and more reliable for builds. And the backend exposes port 8000 and starts with `npm start`, which runs `nodemon` so the server restarts when files change.

### compose.yaml

The repo version is fully commented. Without comments:

```yaml
services:
  web:
    depends_on:
      - api
    build: ./frontend
    ports:
      - 5173:5173
    environment:
      VITE_API_URL: http://localhost:8000
    develop:
      watch:
        - path: ./frontend/package.json
          action: rebuild
        - path: ./frontend/package-lock.json
          action: rebuild
        - path: ./frontend
          target: /app
          action: sync

  api:
    depends_on:
      - db
    build: ./backend
    ports:
      - 8000:8000
    environment:
      DB_URL: mongodb://db/anime
    develop:
      watch:
        - path: ./backend/package.json
          action: rebuild
        - path: ./backend/package-lock.json
          action: rebuild
        - path: ./backend
          target: /app
          action: sync

  db:
    image: mongo:latest
    ports:
      - 27017:27017
    volumes:
      - anime:/data/db

volumes:
  anime:
```

Two lines that confuse almost everyone:

- **`DB_URL: mongodb://db/anime` — why not `localhost`?** The API runs inside a container, where `localhost` means that container itself. On the Compose network, every service name is a hostname, so `db` points to the MongoDB container.
- **`VITE_API_URL: http://localhost:8000` — then why `localhost` here?** Because React code doesn't run in the `web` container. It runs in **your browser**, outside Docker, where the API is reachable on the published port 8000.

Rule of thumb: **container → container = service name. Browser → container = localhost + published port.**

### Start the stack

```bash
docker compose up --build
```

Compose builds two images, pulls MongoDB, creates the network and the `anime` volume, then starts `db`, `api` and `web` in that order (`depends_on`). Open:

- Frontend: **http://localhost:5173**
- API: **http://localhost:8000/api/anime**

Check the API logs (in a second terminal, or start with `-d`):

```bash
docker compose logs api
```

```
api-1  | server listening on port 8000
api-1  | Successfully connected to database
```

The API found MongoDB by its service name.

### Add some data

Use the Share page, or call the API directly:

```bash
curl -X POST http://localhost:8000/api/anime \
  -H "Content-Type: application/json" \
  -d '{"title": "Naruto", "description": "A ninja story"}'

curl http://localhost:8000/api/anime
```

```
[{"_id":"6ace2542f8bee954078eba94","title":"Naruto","description":"A ninja story","__v":0}]
```

### Does the data survive?

```bash
docker compose down
docker compose up -d
curl http://localhost:8000/api/anime
```

Naruto is still there: MongoDB's files live in the `anime` volume, not in the container. Now with `-v`:

```bash
docker compose down -v
docker compose up -d
curl http://localhost:8000/api/anime
```

```
[]
```

Empty. `-v` deleted the volume and every record in it. Use `down` day to day; use `down -v` only when you want a fresh database.

### Live development with Compose Watch

```bash
docker compose down
docker compose watch
```

Edit `backend/index.js` — change `res.send("Hello World!")` to `res.send("Hello from Docker Compose Watch!")` — and save. Compose prints:

```
Syncing service "api" after 1 changes were detected
```

nodemon restarts the server inside the container, and `curl http://localhost:8000/` returns the new text — no rebuild, nothing restarted by hand. Edit a React component and the browser updates the same way. Add a package and Compose rebuilds the image for you, because `package.json` is set to `rebuild`.

The frontend's `vite.config.js` has two settings that make this work:

```js
server: {
  host: true,                    // same job as "vite --host"
  port: 5173,
  watch: { usePolling: true },   // notice files synced in by compose watch
},
```

Press `Ctrl + C` to stop watching, then `docker compose down`.

**Bonus:** want to run the Node apps on your machine but skip installing MongoDB? Start only the database: `docker compose up -d db`. It's available at `mongodb://localhost:27017/anime`.

---

## 10. Troubleshooting

- **`port is already allocated`** — another program uses that port. Map a different host port, e.g. `-p 3000:5173`, and open http://localhost:3000.
- **Page doesn't load, but the logs say "ready"** — Vite is only listening inside the container. Use `"dev": "vite --host"`.
- **`EACCES: permission denied`** — the non-root `app` user can't write to `/app`. Keep `RUN chown -R app:app .` before `npm install` / `npm ci`.
- **`Cannot find native binding` or `vite: not found`** — a bind mount hid the container's `node_modules`. Add `-v /app/node_modules`.
- **A new npm package is missing in the container** — `docker compose down -v`, then `docker compose up --build`.
- **`database connection failed. exiting now...`** — the API can't reach MongoDB. Check `docker compose ps` and that `DB_URL` is `mongodb://db/anime`, then `docker compose restart api`.
- **Edits don't show up in mern-docker** — `docker compose up` doesn't sync files. Use `docker compose watch`.
- **`Cannot connect to the Docker daemon`** — Docker isn't running. Start Docker Desktop, or run `sudo systemctl start docker` on Linux.

---

## 11. Cheat sheet and what's next

Every command from this guide and more — grouped by **image, container, volume, network**, plus builds, Compose, registry and cleanup — is on one page:

**[Docker Commands Cheat Sheet](https://github.com/Tanvirulislam345/docker-course/blob/main/docker-commands-cheatsheet.md)**

### What you learned

- Why Docker exists and the problems it solves.
- The four building blocks: images, containers, volumes and networks.
- How the client, daemon and registry work together.
- How to write a Dockerfile, and why instruction order matters for caching.
- `docker run` flags: `-p`, `-d`, `--name`, `-v`, `--rm`.
- Docker Compose for multi-container apps, and Compose Watch for a fast dev loop.
- A full MERN stack running with one command.

### Where to go next

- **Multi-stage builds** — compile React to static files and serve them from a tiny production image.
- **Push to Docker Hub** — `docker tag` and `docker push`, then `docker pull` on a server.
- **CI/CD** — build and push images automatically with GitHub Actions.
- **Kubernetes** — run and scale containers across many machines.

The code for everything here: **https://github.com/Tanvirulislam345/docker-course**

If this guide helped, leave a clap, star the repo, and share it with the next person who says "but it works on my machine".
