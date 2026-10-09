
# Dockerized MERN Task Manager

A containerized task management application built using React, Node.js, Express, and MongoDB. Docker Compose orchestrates the services, while Nginx serves the frontend and reverse-proxies API requests to the backend.

## Architecture

```text
Browser
   |
   | HTTP :3000
   v
Nginx + React (Frontend)
   |
   | /api/* proxy
   v
Node.js + Express (Backend)
   |
   | MongoDB connection
   v
MongoDB (Database)
   |
   v
Docker Named Volume
```

## Tech Stack

- **Frontend:** React, Vite
- **Web Server:** Nginx
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Networking:** Custom Docker bridge network
- **Persistence:** Docker named volume

## Features

- Create tasks through a React interface.
- Store tasks in MongoDB.
- Retrieve previously saved tasks.
- Route API requests through Nginx.
- Run the application as separate containers.
- Persist database files using a named volume.
- Configure services using environment variables.
- Build the frontend using a multi-stage Docker build.

## Project Structure

```text
dockerized-mern-stack/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── Dockerfile
│   ├── index.html
│   └── nginx.conf
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Docker Engine
- Docker Compose v2
- Git

## Setup and Deployment

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd dockerized-mern-stack
```

### 2. Configure environment variables

Create your local environment file:

```bash
cp .env.example .env
nano .env
```

Set a strong database password in `.env`. Do not commit this file to Git.

### 3. Build and start the services

```bash
docker compose up -d --build
```

### 4. Verify the containers

```bash
docker compose ps
```

Check application logs:

```bash
docker compose logs --tail=50 backend
docker compose logs --tail=50 frontend
```

### 5. Open the application

Visit:

```text
http://localhost:3000
```

If the application runs inside a virtual machine, use the VM's reachable IP address and ensure port 3000 is accessible.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/tasks` | Retrieve tasks |
| POST | `/api/tasks` | Create a task |

Example request to create a task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker Compose"}'
```

## Persistence

MongoDB uses the `mongo_data` named volume to retain database files across ordinary container restarts and container recreation.

Inspect the volume:

```bash
docker volume ls
```

Do not use `docker compose down -v` unless you intentionally want to remove the Compose-managed volumes and their stored database data.

## Networking

The services communicate over a custom Docker bridge network named `mern-network`.

- The frontend publishes port `3000` on the host and serves HTTP on port `80` inside its container.
- Nginx forwards `/api/` requests to the backend service on port `5000`.
- MongoDB listens internally on port `27017` and is not published directly to the host.

## Security Notes

- Keep `.env` out of version control.
- Use strong database credentials.
- Avoid exposing MongoDB directly to the public internet.
- For production deployments, use HTTPS, stronger application-level authentication, and a managed secrets solution.

## Current Scope

The current application supports task creation and listing. User authentication, task editing, deletion, and completion tracking are not implemented yet.

License

Copyright © 2026 [Shubham Gavhane]. All rights reserved.

This repository is publicly available for viewing, learning, and personal educational use.

Permission is granted to view and study the source code for non-commercial purposes. Redistribution, publication of modified versions, sublicensing, or commercial use of this project or substantial portions of its original source code requires prior written permission from the copyright holder.

Third-party libraries, dependencies, and components remain subject to their respective licenses.

The software is provided "AS IS", without warranty of any kind, express or implied, to the extent permitted by applicable law.
