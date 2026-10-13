# MERN Backend

An Express 5 + Mongoose API for the Anime sharing app. It stores anime in MongoDB and runs with nodemon. You can run it with Docker or directly with Node.js.

## Prerequisites

- [Git](https://git-scm.com/)
- To run with Docker: [Docker](https://docs.docker.com/get-docker/)
- To run manually: [Node.js](https://nodejs.org/) 24 or newer (npm comes with it)
- A running [MongoDB](https://www.mongodb.com/try/download/community) database

## 1. Clone the repository

```bash
git clone https://github.com/Tanvirulislam345/docker-course.git
cd docker-course/mern-docker/backend
```

## 2. Run with Docker

The easiest way is to run the whole stack (frontend, backend and MongoDB) with Docker Compose from the parent folder. See [../README.md](../README.md).

To run only the backend container:

### Build the image

```bash
docker build -t mern-backend .
```

### Run the container

The API needs a MongoDB URL. This example connects to MongoDB running on your machine:

```bash
docker run -p 8000:8000 \
  -e DB_URL=mongodb://host.docker.internal:27017/anime \
  --add-host=host.docker.internal:host-gateway \
  mern-backend
```

Open http://localhost:8000 in your browser.

> `--add-host` is needed on Linux. On Docker Desktop (Windows/macOS), `host.docker.internal` works without it.

### Run in the background

```bash
docker run -d -p 8000:8000 \
  -e DB_URL=mongodb://host.docker.internal:27017/anime \
  --add-host=host.docker.internal:host-gateway \
  --name mern-api mern-backend
```

```bash
docker ps               # list running containers
docker logs mern-api    # see the app output
docker stop mern-api    # stop the container
docker rm mern-api      # remove the container
```

## 3. Run manually (without Docker)

```bash
cp .env.example .env    # then set DB_URL, for example mongodb://localhost:27017/anime
npm install
npm start
```

The API runs at http://localhost:8000.

### Environment variables

| Variable | Required | What it does                                        |
| -------- | -------- | --------------------------------------------------- |
| `DB_URL` | Yes      | MongoDB connection string                           |
| `PORT`   | No       | Port the server listens on (default `8000`)         |

### Scripts

| Command     | What it does                                       |
| ----------- | -------------------------------------------------- |
| `npm start` | Start the server with nodemon (restarts on change) |

## API endpoints

| Method | Path         | What it does           |
| ------ | ------------ | ---------------------- |
| `GET`  | `/`          | Returns `Hello World!` |
| `GET`  | `/api/anime` | Lists all anime        |
| `POST` | `/api/anime` | Creates a new anime    |

Create an anime (`title` is required, `link` and `description` are optional):

```bash
curl -X POST http://localhost:8000/api/anime \
  -H "Content-Type: application/json" \
  -d '{"title": "Naruto", "link": "https://example.com", "description": "A ninja story"}'
```

## Project structure

```
backend/
├── database/
│   ├── anim.model.js  # Mongoose model for an anime
│   └── connect.js     # connects to MongoDB using DB_URL
├── index.js           # Express app and API routes
├── Dockerfile         # builds the Docker image
├── .dockerignore      # files left out of the Docker image
├── .env.example       # example environment variables
└── package.json
```

## Troubleshooting

- **`database connection failed. exiting now...`:** the server couldn't reach MongoDB and stopped. Check that MongoDB is running and that `DB_URL` is correct.
- **Port 8000 is already in use:** map a different host port, for example `docker run -p 3001:8000 ...`, or set `PORT` in `.env` when running manually.
- **`EACCES: permission denied`:** the Dockerfile runs the app as a non-root `app` user and gives it ownership of `/app`. If you change the Dockerfile, keep the `chown -R app:app .` step before `npm ci`.
