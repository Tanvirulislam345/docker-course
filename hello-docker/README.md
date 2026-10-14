# Hello Docker

A minimal Node.js app that prints `Hello, Docker!` from inside a Docker container.

## Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://docs.docker.com/get-docker/)
- Optional, to run without Docker: [Node.js](https://nodejs.org/) 22 or newer

## 1. Clone the repository

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/hello-docker
```

## 2. Run with Docker

### Build the image

```bash
docker build -t hello-docker .
```

### Run the container

```bash
docker run --rm hello-docker
```

Expected output:

```
Hello, Docker!
```

The app prints one line and exits, so you don't need to map a port. `--rm` removes the container once it stops.

### Use a different Node.js version (optional)

The Dockerfile reads the Node.js version from the `NODE_VERSION` build argument (default `22.21.1`):

```bash
docker build --build-arg NODE_VERSION=20 -t hello-docker .
```

### Clean up

```bash
docker images            # list images
docker rmi hello-docker  # remove the image
```

## 3. Run manually (without Docker)

```bash
node app.js
```

## Project structure

```
hello-docker/
├── app.js       # prints "Hello, Docker!"
└── Dockerfile   # builds the image
```

What the Dockerfile does:

| Line | Purpose |
|------|---------|
| `ARG NODE_VERSION=22.21.1` | Sets the default Node.js version, which you can change at build time |
| `FROM node:${NODE_VERSION}-alpine` | Starts from a small Alpine-based Node.js image |
| `WORKDIR /app` | Uses `/app` as the working directory inside the container |
| `COPY . .` | Copies the project files into the image |
| `CMD ["node", "app.js"]` | Runs the app when the container starts |

## Read along

- 📖 [Docker One Shot](https://github.com/Tanvirulislam345/Docker-One-Short): the full guide that walks through this project step by step
- 📋 [Docker Commands Cheat Sheet](https://gist.github.com/Tanvirulislam345/cc0ac98b03cf9e583ba698ce05d9606f): every command used here, and more
