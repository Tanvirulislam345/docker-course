# React Docker

A React 19 + TypeScript + Vite app that runs in a Docker container. You can run it with Docker or directly with Node.js.

## Prerequisites

- [Git](https://git-scm.com/)
- To run with Docker: [Docker](https://docs.docker.com/get-docker/)
- To run manually: [Node.js](https://nodejs.org/) 22 or newer (npm comes with it)

## 1. Clone the repository

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/react-docker
```

## 2. Run with Docker Compose

```bash
docker compose up
```

Open http://localhost:5173 in your browser.

```bash
docker ps                # list running containers
docker logs react-app    # see the app output
docker stop react-app    # stop the container
docker rm react-app      # remove the container
```

## 3. Run manually (without Docker)

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Other scripts

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint                           |

## Project structure

```
react-docker/
├── public/            # static files
├── src/               # React source code
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── Dockerfile         # builds the Docker image
├── .dockerignore      # files left out of the Docker image
├── compose.yaml       # compose file to set port, volume, networks
├── index.html
├── package.json
└── vite.config.ts
```

## Troubleshooting

- **Port 5173 is already in use:** map a different host port, update compose.yaml file `3000:5173`, then open http://localhost:3000.
- **Page doesn't load from Docker:** the `dev` script runs `vite --host` so the server listens on all interfaces. Keep the `--host` flag if you change the script.
- **`EACCES: permission denied`:** the Dockerfile runs the app as a non-root `app` user and gives it ownership of `/app`. If you change the Dockerfile, keep the `chown -R app:app .` step before `npm install`.
