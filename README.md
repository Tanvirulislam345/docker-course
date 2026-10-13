# Docker Course

Learn Docker by running four projects, from a one-line Node.js app to a full MERN stack with Docker Compose Watch.

![Docker One Shot](blog/images/00-banner.png)

| # | Project | What you learn |
| --- | --- | --- |
| 1 | [hello-docker](hello-docker) | Your first Dockerfile, `docker build`, `docker run`, `--build-arg` |
| 2 | [react-docker](react-docker) | Port mapping, bind mounts, live reload, non-root user, layer cache |
| 3 | [react-docker-compose](react-docker-compose) | Turning a long `docker run` command into `compose.yaml` |
| 4 | [mern-docker](mern-docker) | MongoDB + Express + React + Node with Compose, named volumes and `docker compose watch` |

Each project folder has its own README with step-by-step instructions.

## Read along

- 📖 [Docker One Shot](blog/docker-one-shot.md) — the full beginner-friendly guide that walks through all four projects
- 📋 [Docker Commands Cheat Sheet](docker-commands-cheatsheet.md) — image, container, volume, network, build and Compose commands

## Quick start

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/hello-docker
docker build -t hello-docker .
docker run --rm hello-docker
```
