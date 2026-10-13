# MERN Frontend

A React 19 + Vite app for the Anime sharing app. It uses React Router and axios to talk to the backend API. You can run it with Docker or directly with Node.js.

- **Home** (`/`) lists all anime.
- **Share** (`/create`) adds a new anime.

## Prerequisites

- [Git](https://git-scm.com/)
- To run with Docker: [Docker](https://docs.docker.com/get-docker/)
- To run manually: [Node.js](https://nodejs.org/) 24 or newer (npm comes with it)
- The [backend API](../backend/README.md) running on http://localhost:8000

## 1. Clone the repository

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/mern-docker/frontend
```

## 2. Run with Docker

The easiest way is to run the whole stack (frontend, backend and MongoDB) with Docker Compose from the parent folder. See [../README.md](../README.md).

To run only the frontend container:

### Build the image

```bash
docker build -t mern-frontend .
```

### Run the container

```bash
docker run -p 5173:5173 -e VITE_API_URL=http://localhost:8000 mern-frontend
```

Open http://localhost:5173 in your browser.

### Run in the background

```bash
docker run -d -p 5173:5173 -e VITE_API_URL=http://localhost:8000 --name mern-web mern-frontend
```

```bash
docker ps               # list running containers
docker logs mern-web    # see the app output
docker stop mern-web    # stop the container
docker rm mern-web      # remove the container
```

### Live reload while developing (optional)

Mount your source code into the container so your edits show up without rebuilding the image:

```bash
docker run -p 5173:5173 -e VITE_API_URL=http://localhost:8000 \
  -v "$(pwd):/app" -v /app/node_modules mern-frontend
```

The second `-v /app/node_modules` keeps the container's installed packages from being replaced by your local folder.

> On Windows, use `${PWD}` in PowerShell or `%cd%` in Command Prompt instead of `$(pwd)`.

## 3. Run manually (without Docker)

```bash
cp .env.example .env    # then set VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Environment variables

| Variable       | What it does                                         |
| -------------- | ---------------------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:8000` |

### Other scripts

| Command           | What it does                         |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server with hot reload |
| `npm run build`   | Build for production                 |
| `npm run preview` | Serve the production build locally   |
| `npm run lint`    | Run ESLint                           |

## Project structure

```
frontend/
├── public/            # static files
├── src/               # React source code
│   ├── assets/
│   ├── pages/
│   │   ├── Home.jsx   # lists all anime
│   │   └── Create.jsx # form to share a new anime
│   ├── App.jsx        # navbar and routes
│   └── main.jsx
├── Dockerfile         # builds the Docker image
├── .dockerignore      # files left out of the Docker image
├── .env.example       # example environment variables
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Troubleshooting

- **Port 5173 is already in use:** map a different host port, for example `docker run -p 3000:5173 mern-frontend`, then open http://localhost:3000.
- **Page doesn't load from Docker:** the `dev` script runs `vite --host` and `vite.config.js` sets `server.host: true`, so the server listens on all interfaces. Keep them if you change the script or config.
- **No anime show up or the network request fails:** check that the backend is running and that `VITE_API_URL` points to it. Restart the dev server after changing `VITE_API_URL`, because Vite reads it only at startup.
- **`EACCES: permission denied`:** the Dockerfile runs the app as a non-root `app` user and gives it ownership of `/app`. If you change the Dockerfile, keep the `chown -R app:app .` step before `npm ci`.
