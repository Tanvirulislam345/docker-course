# MERN Docker

An Anime sharing app built with MongoDB, Express, React and Node.js (MERN). Docker Compose runs the whole stack as three containers. You can also run each part directly with Node.js.

| Service | Built from             | Port  | What it is                      |
| ------- | ---------------------- | ----- | ------------------------------- |
| `web`   | `./frontend`           | 5173  | React + Vite frontend           |
| `api`   | `./backend`            | 8000  | Express + Mongoose API          |
| `db`    | `mongo:latest` image   | 27017 | MongoDB database                |

## Prerequisites

- [Git](https://git-scm.com/)
- To run with Docker: [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2.22 or newer (needed for `docker compose watch`)
- To run manually: [Node.js](https://nodejs.org/) 24 or newer (npm comes with it) and [MongoDB](https://www.mongodb.com/try/download/community)

## 1. Clone the repository

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/mern-docker
```

## 2. Run with Docker Compose

### Build and start all services

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:8000/api/anime
- MongoDB: `mongodb://localhost:27017/anime`

### Run in the background

```bash
docker compose up -d --build
```

```bash
docker compose ps          # list running containers
docker compose logs -f api # see the output of one service (web, api or db)
docker compose stop        # stop the containers
docker compose down        # stop and remove the containers
docker compose down -v     # also delete the "anime" volume (all database data)
```

### Live reload while developing

```bash
docker compose watch
```

Compose watches the files listed under `develop.watch` in `compose.yaml`:

- Changes in `frontend/` or `backend/` are synced into the running container right away.
- Changes in `package.json` or `package-lock.json` rebuild the image and restart the container.

### How the services connect

- `depends_on` starts the services in order: `db` → `api` → `web`.
- The `api` connects to MongoDB with `DB_URL=mongodb://db/anime`. Inside the Compose network, the service name `db` works as the host name.
- The `web` calls the API with `VITE_API_URL=http://localhost:8000`. This request runs in your browser, not in the container, so it uses `localhost`.
- MongoDB stores its data in the named volume `anime`, so the data is kept when the containers are removed.

## 3. Run manually (without Docker)

Start MongoDB on port 27017. If you have Docker, you can start only the database:

```bash
docker compose up -d db
```

Start the backend in one terminal:

```bash
cd backend
cp .env.example .env    # then set DB_URL=mongodb://localhost:27017/anime
npm install
npm start
```

Start the frontend in another terminal:

```bash
cd frontend
cp .env.example .env    # then set VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for more details on each part.

## Project structure

```
mern-docker/
├── backend/           # Express + Mongoose API (see backend/README.md)
│   ├── database/
│   ├── Dockerfile
│   └── index.js
├── frontend/          # React + Vite app (see frontend/README.md)
│   ├── src/
│   ├── Dockerfile
│   └── vite.config.js
├── compose.yaml       # defines the web, api and db services and the anime volume
└── .gitignore
```

## Troubleshooting

- **Port is already in use:** change the host port in `compose.yaml`, for example `3000:5173` for `web`, then open http://localhost:3000.
- **`database connection failed. exiting now...`:** the API could not reach MongoDB. Check that the `db` container is running (`docker compose ps`) and that `DB_URL` is correct, then run `docker compose restart api`.
- **The frontend shows no anime or network errors:** check that the `api` container is running and that `VITE_API_URL` points to http://localhost:8000.
- **Edits don't show up in the container:** start the stack with `docker compose watch`. `docker compose up` alone doesn't sync files. The frontend `vite.config.js` uses polling so Vite sees the synced files.
- **`EACCES: permission denied`:** the Dockerfiles run the apps as a non-root `app` user and give it ownership of `/app`. If you change a Dockerfile, keep the `chown -R app:app .` step before `npm ci`.

## Read along

- 📖 [One Shot Docker](https://github.com/Tanvirulislam345/One-Shot-Docker): the full guide that walks through this project step by step
- 📋 [Docker Commands Cheat Sheet](https://gist.github.com/Tanvirulislam345/cc0ac98b03cf9e583ba698ce05d9606f): every command used here, and more
