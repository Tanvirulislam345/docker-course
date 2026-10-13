# 🐳 Docker Commands Cheat Sheet

Every Docker command you need day to day, grouped by **image**, **container**, **volume**, **network**, **Dockerfile build**, **Docker Compose**, **registry** and **cleanup**.

Companion to the blog post **Docker One Shot** and the hands-on projects in this repo: [hello-docker](hello-docker), [react-docker](react-docker), [react-docker-compose](react-docker-compose), [mern-docker](mern-docker).

> 💡 Most commands accept either a **name** (`react-app`) or an **ID** (`2eebe179ab91`). You only need to type the first few characters of an ID, e.g. `docker rm 2ee`.

## Contents

- [Images](#-images)
- [Containers](#-containers)
- [Volumes](#-volumes)
- [Networks](#-networks)
- [Building images (Dockerfile)](#-building-images-dockerfile)
- [Docker Compose](#-docker-compose)
- [Registry (Docker Hub)](#-registry-docker-hub)
- [System & cleanup](#-system--cleanup)
- [Useful `docker run` flags](#-useful-docker-run-flags)

---

## 📦 Images

| Command | What it does |
| --- | --- |
| `docker images` | List images on your machine (same as `docker image ls`) |
| `docker images -a` | List all images, including intermediate ones |
| `docker images -q` | List only image IDs |
| `docker pull nginx` | Download an image (tag `latest` by default) |
| `docker pull node:22-alpine` | Download a specific tag |
| `docker image inspect nginx` | Show full details (layers, env, ports) as JSON |
| `docker image history nginx` | Show the layers an image is built from |
| `docker tag react-docker myname/react-docker:1.0` | Add a new name/tag to an image |
| `docker rmi nginx` | Remove one image |
| `docker rmi nginx mongo hello-docker` | Remove several images at once |
| `docker rmi -f nginx` | Force remove (even if a stopped container uses it) |
| `docker rmi $(docker images -q)` | Remove **all** images |
| `docker image prune` | Remove dangling images (`<none>` tags) |
| `docker image prune -a` | Remove every image not used by a container |
| `docker save -o app.tar react-docker` | Export an image to a `.tar` file |
| `docker load -i app.tar` | Import an image from a `.tar` file |

## 🟢 Containers

### Run & create

| Command | What it does |
| --- | --- |
| `docker run nginx` | Create and start a container (foreground) |
| `docker run -d nginx` | Run in the background (detached) |
| `docker run --name web nginx` | Give the container a name |
| `docker run -p 8080:80 nginx` | Map host port 8080 → container port 80 |
| `docker run --rm hello-docker` | Delete the container automatically when it stops |
| `docker run -it node:22-alpine sh` | Start an interactive shell |
| `docker run -e DB_URL=mongodb://db/anime mern-backend` | Set an environment variable |
| `docker run --env-file .env mern-backend` | Load env variables from a file |
| `docker run -v "$(pwd):/app" react-docker` | Bind-mount the current folder into `/app` |
| `docker run -v /app/node_modules react-docker` | Anonymous volume (protects `node_modules`) |
| `docker run -v anime:/data/db mongo` | Mount a named volume |
| `docker run --network my-net mongo` | Attach to a network |
| `docker create --name web nginx` | Create a container without starting it |

### List & inspect

| Command | What it does |
| --- | --- |
| `docker ps` | List running containers (same as `docker container ls`) |
| `docker ps -a` | List all containers, including stopped ones |
| `docker ps -q` | List only IDs of running containers |
| `docker ps -aq` | List IDs of all containers |
| `docker logs web` | Show a container's output |
| `docker logs -f web` | Follow the logs live (Ctrl+C to quit) |
| `docker logs --tail 50 web` | Show only the last 50 lines |
| `docker inspect web` | Full details (IP, mounts, env) as JSON |
| `docker stats` | Live CPU / memory usage of running containers |
| `docker top web` | Processes running inside a container |
| `docker port web` | Show the port mappings |
| `docker diff web` | Files changed inside the container |

### Start, stop & interact

| Command | What it does |
| --- | --- |
| `docker stop web` | Stop gracefully |
| `docker stop web api db` | Stop several containers |
| `docker stop $(docker ps -q)` | Stop **all** running containers |
| `docker start web` | Start a stopped container |
| `docker restart web` | Restart |
| `docker kill web` | Force stop immediately |
| `docker pause web` / `docker unpause web` | Freeze / unfreeze processes |
| `docker exec -it web sh` | Open a shell inside a running container (`bash` on non-Alpine images) |
| `docker exec web ls /app` | Run a single command inside a container |
| `docker cp web:/app/log.txt .` | Copy a file from container to host |
| `docker cp ./config.json web:/app/` | Copy a file from host to container |
| `docker rename web web-old` | Rename a container |

### Remove

| Command | What it does |
| --- | --- |
| `docker rm web` | Remove one stopped container |
| `docker rm web api db` | Remove several containers |
| `docker rm -f web` | Force remove a running container |
| `docker rm $(docker ps -aq)` | Remove **all** stopped containers |
| `docker rm -f $(docker ps -aq)` | Stop and remove **all** containers |
| `docker container prune` | Remove all stopped containers |

## 💾 Volumes

| Command | What it does |
| --- | --- |
| `docker volume create my-data` | Create a named volume |
| `docker volume ls` | List volumes |
| `docker volume ls -f dangling=true` | List volumes not used by any container |
| `docker volume inspect my-data` | Show where the volume lives and its details |
| `docker volume rm my-data` | Remove one volume |
| `docker volume rm my-data logs-data` | Remove several volumes |
| `docker volume rm $(docker volume ls -q)` | Remove **all** volumes not in use |
| `docker volume prune` | Remove unused anonymous volumes |
| `docker volume prune -a` | Remove all unused volumes, named ones too |

Three kinds of mounts:

| Type | Example | Use it for |
| --- | --- | --- |
| Named volume | `-v anime:/data/db` | Database data you want to keep |
| Bind mount | `-v "$(pwd):/app"` | Live-editing source code during development |
| Anonymous volume | `-v /app/node_modules` | Stopping a bind mount from hiding a folder |

## 🌐 Networks

| Command | What it does |
| --- | --- |
| `docker network ls` | List networks |
| `docker network create my-net` | Create a bridge network |
| `docker network inspect my-net` | Show which containers are attached and their IPs |
| `docker network connect my-net web` | Attach a running container to a network |
| `docker network disconnect my-net web` | Detach it |
| `docker network rm my-net` | Remove one network |
| `docker network rm net1 net2` | Remove several networks |
| `docker network prune` | Remove all unused networks |

> 💡 Containers on the **same user-created network** reach each other by **container name** (or service name in Compose), e.g. `mongodb://db:27017`.

## 🔨 Building images (Dockerfile)

| Command | What it does |
| --- | --- |
| `docker build .` | Build from the `Dockerfile` in the current folder |
| `docker build -t react-docker .` | Build and name (tag) the image |
| `docker build -t react-docker:1.0 .` | Build with a version tag |
| `docker build -f Dockerfile.dev -t app-dev .` | Use a different Dockerfile |
| `docker build --build-arg NODE_VERSION=20 -t hello-docker .` | Pass a value to an `ARG` |
| `docker build --no-cache -t react-docker .` | Rebuild every layer, ignore the cache |
| `docker build --progress=plain .` | Show the full build output |
| `docker builder prune` | Clear the build cache |

Dockerfile instructions at a glance:

| Instruction | Runs at | What it does |
| --- | --- | --- |
| `FROM node:22-alpine` | build | Base image (first line) |
| `WORKDIR /app` | build | Set (and create) the working folder |
| `COPY package*.json ./` | build | Copy files from your computer into the image |
| `RUN npm install` | build | Run a command while building |
| `ARG NODE_VERSION=22` | build | Build-time variable (`--build-arg`) |
| `ENV PORT=8000` | run | Environment variable for the running app |
| `EXPOSE 5173` | info | Document the app's port (publish it with `-p`) |
| `VOLUME /data/db` | run | Mark a folder for volume storage |
| `USER app` | build + run | Run the next steps and the app as this user |
| `CMD ["npm", "run", "dev"]` | run | Default command when the container starts |

## 🐙 Docker Compose

Run these in the folder that has `compose.yaml`.

| Command | What it does |
| --- | --- |
| `docker compose up` | Create and start all services (foreground) |
| `docker compose up -d` | Start in the background |
| `docker compose up --build` | Rebuild images first, then start |
| `docker compose up -d db` | Start only one service (and its dependencies) |
| `docker compose watch` | Start and sync/rebuild on file changes (`develop.watch`) |
| `docker compose ps` | List the project's containers |
| `docker compose logs` | Show logs of all services |
| `docker compose logs -f api` | Follow the logs of one service |
| `docker compose exec api sh` | Open a shell in a running service |
| `docker compose run --rm api npm test` | Run a one-off command in a new container |
| `docker compose build` | Build (or rebuild) the images |
| `docker compose pull` | Pull the latest images for services that use `image:` |
| `docker compose stop` | Stop the containers (keep them) |
| `docker compose start` | Start stopped containers |
| `docker compose restart api` | Restart one service |
| `docker compose down` | Stop and remove containers and the network |
| `docker compose down -v` | …and delete the volumes (**deletes database data**) |
| `docker compose down --rmi all` | …and delete the images too |
| `docker compose config` | Print the final config (good for spotting YAML mistakes) |
| `docker compose -f compose.prod.yaml up -d` | Use a different compose file |

`develop.watch` actions:

| Action | What happens | Use it for |
| --- | --- | --- |
| `sync` | Copies changed files into the running container | Source code with hot reload (Vite, nodemon) |
| `rebuild` | Builds a new image and replaces the container | `package.json`, lock files, Dockerfile |
| `sync+restart` | Copies the files, then restarts the container | Config files read only at startup |

## ☁️ Registry (Docker Hub)

| Command | What it does |
| --- | --- |
| `docker login` | Log in to Docker Hub |
| `docker search nginx` | Search Docker Hub |
| `docker tag react-docker yourname/react-docker:1.0` | Name the image for your account |
| `docker push yourname/react-docker:1.0` | Upload the image |
| `docker pull yourname/react-docker:1.0` | Download it on any other machine |
| `docker logout` | Log out |

## 🧹 System & cleanup

| Command | What it does |
| --- | --- |
| `docker version` | Client and server (daemon) versions |
| `docker info` | System-wide info: containers, images, storage driver |
| `docker system df` | Disk space used by images, containers, volumes, cache |
| `docker system prune` | Remove stopped containers, unused networks, dangling images, build cache |
| `docker system prune -a` | …and every unused image |
| `docker system prune -a --volumes` | ⚠️ Remove **everything** unused, volumes included |

## 🚩 Useful `docker run` flags

| Flag | Meaning | Example |
| --- | --- | --- |
| `-d` | Detached (background) | `docker run -d nginx` |
| `-p host:container` | Publish a port | `-p 3000:5173` |
| `--name` | Container name | `--name react-app` |
| `--rm` | Remove when stopped | `docker run --rm hello-docker` |
| `-v` | Volume or bind mount | `-v "$(pwd):/app"` |
| `-e` | Environment variable | `-e VITE_API_URL=http://localhost:8000` |
| `--env-file` | Env variables from a file | `--env-file .env` |
| `-it` | Interactive terminal | `docker run -it node:22-alpine sh` |
| `--network` | Join a network | `--network my-net` |
| `--restart` | Restart policy | `--restart unless-stopped` |
| `-w` | Working directory | `-w /app` |
| `--add-host` | Add a host entry (reach your machine from Linux containers) | `--add-host=host.docker.internal:host-gateway` |

> On Windows, use `${PWD}` in PowerShell or `%cd%` in Command Prompt instead of `$(pwd)`.
