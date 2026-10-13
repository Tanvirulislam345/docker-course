# React Docker Compose

A React 19 + TypeScript + Vite app that runs in a Docker container with Docker Compose. You can run it with Docker Compose or directly with Node.js.

## Prerequisites

- [Git](https://git-scm.com/)
- To run with Docker: [Docker](https://docs.docker.com/get-docker/) (Docker Compose comes with it)
- To run manually: [Node.js](https://nodejs.org/) 22 or newer (npm comes with it)

## 1. Clone the repository

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/react-docker-compose
```

## 2. Run with Docker Compose

### Build and start the container

```bash
docker compose up --build
```

Open http://localhost:5173 in your browser.

`--build` rebuilds the image when the `Dockerfile` or `package.json` changes. You can leave it out after the first run.

### Run in the background

```bash
docker compose up -d --build
```

```bash
docker compose ps          # list running containers
docker compose logs -f web # see the app output
docker compose stop        # stop the container
docker compose down        # stop and remove the container
```

### Live reload while developing

`compose.yaml` already mounts your source code into the container, so your edits show up without rebuilding the image:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

The first volume maps the project folder to `/app` in the container. The second `/app/node_modules` keeps the container's installed packages from being replaced by your local folder.

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
react-docker-compose/
├── public/            # static files
├── src/               # React source code
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── Dockerfile         # builds the Docker image
├── .dockerignore      # files left out of the Docker image
├── compose.yaml       # Compose file that sets the port and volumes
├── index.html
├── package.json
├── tsconfig.json      # TypeScript config (references the app and node configs)
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Troubleshooting

- **Port 5173 is already in use:** change the host port in `compose.yaml`, for example `3000:5173`, then open http://localhost:3000.
- **Page doesn't load from Docker:** the `dev` script runs `vite --host` so the server listens on all interfaces. Keep the `--host` flag if you change the script.
- **A new package is missing in the container:** the `/app/node_modules` volume keeps the old packages. Run `docker compose down -v` and then `docker compose up --build`.
- **`EACCES: permission denied`:** the Dockerfile runs the app as a non-root `app` user and gives it ownership of `/app`. If you change the Dockerfile, keep the `chown -R app:app .` step before `npm install`.
