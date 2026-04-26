# CampusConnect – Smart Resource Allocation System

A full-stack web application for managing campus resource bookings.
**Backend:** Spring Boot 3 · Java 21 · Spring Security (JWT) · JPA/Hibernate · PostgreSQL  
**Frontend:** React 18 · Vite · Tailwind CSS · Framer Motion · Axios

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Quick Start (Dev Mode)](#quick-start-dev-mode)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [API Reference](#api-reference)
6. [Database Setup (PostgreSQL)](#database-setup-postgresql)
7. [Production Build](#production-build)
8. [Deployment Guide](#deployment-guide)
   - [Deploy Backend to Render](#option-a-render-free-tier)
   - [Deploy Frontend to Vercel](#option-b-vercel-frontend)
   - [Deploy with Docker](#option-c-docker-compose-self-hosted)
9. [Demo Accounts](#demo-accounts)
10. [Resume Notes](#resume-notes-for-java-jd)

---

## Project Structure

```
campusconnect/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/campusconnect/
│   │   ├── config/             # SecurityConfig, OpenApiConfig, DataSeeder
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Custom exceptions + global handler
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── security/           # JWT filter + utils
│   │   └── service/            # Business logic
│   └── src/main/resources/
│       └── application.yml     # Config (dev=H2, prod=PostgreSQL)
└── frontend/                   # React + Vite application
    └── src/
        ├── components/         # Layout, UI components
        ├── hooks/              # useAuth context
        ├── pages/              # All page components
        ├── styles/             # Global CSS with glassmorphism
        └── utils/              # Axios API service
```

---

## Quick Start (Dev Mode)

### Prerequisites

| Tool       | Version  |
| ---------- | -------- |
| Java (JDK) | 17 or 21 |
| Maven      | 3.8+     |
| Node.js    | 18+      |
| npm        | 9+       |

> **Dev mode uses H2 in-memory database** — no PostgreSQL needed!

### Step 1 – Start Backend

```bash
cd campusconnect/backend
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
```

Backend runs at: **http://localhost:8080**  
Swagger UI: **http://localhost:8080/swagger-ui.html**  
H2 Console: **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:campusconnect`)

### Step 2 – Start Frontend

```bash
cd campusconnect/frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Backend Setup

### Install Maven Wrapper (if missing)

```bash
cd backend
mvn wrapper:wrapper
```

### Run with specific profile

```bash
# Dev (H2 in-memory)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Production (PostgreSQL)
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

### Build JAR

```bash
./mvnw clean package -DskipTests
java -jar target/campusconnect-backend-1.0.0.jar
```

### Environment Variables (for prod)

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/campusconnect
DB_USERNAME=campusconnect
DB_PASSWORD=your_password
SPRING_PROFILES_ACTIVE=prod
```

---

## Frontend Setup

### Install dependencies

```bash
cd frontend
npm install
```

### Dev server (with proxy to backend)

```bash
npm run dev
```

### Configure API URL

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

For production:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api/v1
```

### Build for production

```bash
npm run build
# Output goes to: frontend/dist/
```

---

## API Reference

All endpoints are documented at **http://localhost:8080/swagger-ui.html**

### Auth Endpoints (public)

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | `/api/v1/auth/register` | Register new user |
| POST   | `/api/v1/auth/login`    | Login, get JWT    |

### Resource Endpoints

| Method | Endpoint                                     | Auth   | Description                |
| ------ | -------------------------------------------- | ------ | -------------------------- |
| GET    | `/api/v1/resources`                          | Public | Get all resources          |
| GET    | `/api/v1/resources/{id}`                     | Public | Get resource by ID         |
| GET    | `/api/v1/resources/available`                | Public | Get available by date/time |
| POST   | `/api/v1/resources`                          | ADMIN  | Create resource            |
| PUT    | `/api/v1/resources/{id}`                     | ADMIN  | Update resource            |
| PATCH  | `/api/v1/resources/{id}/toggle-availability` | ADMIN  | Toggle availability        |
| DELETE | `/api/v1/resources/{id}`                     | ADMIN  | Soft delete                |

### Booking Endpoints

| Method | Endpoint                       | Auth  | Description          |
| ------ | ------------------------------ | ----- | -------------------- |
| POST   | `/api/v1/bookings`             | USER  | Create booking       |
| GET    | `/api/v1/bookings/my`          | USER  | Get my bookings      |
| GET    | `/api/v1/bookings/all`         | ADMIN | Get all bookings     |
| GET    | `/api/v1/bookings/pending`     | ADMIN | Get pending bookings |
| PATCH  | `/api/v1/bookings/{id}/status` | ADMIN | Approve/reject       |
| PATCH  | `/api/v1/bookings/{id}/cancel` | USER  | Cancel booking       |

### Dashboard

| Method | Endpoint                  | Auth  | Description          |
| ------ | ------------------------- | ----- | -------------------- |
| GET    | `/api/v1/dashboard/stats` | ADMIN | Dashboard statistics |

---

## Database Setup (PostgreSQL)

### Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Windows: Download from https://www.postgresql.org/download/windows/
```

### Create database and user

```sql
-- Connect as postgres superuser
psql -U postgres

CREATE DATABASE campusconnect;
CREATE USER campusconnect WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE campusconnect TO campusconnect;
\q
```

### Update application.yml (or use env vars)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/campusconnect
    username: campusconnect
    password: your_secure_password
```

---

## Production Build

### Backend (fat JAR)

```bash
cd backend
./mvnw clean package -DskipTests
# Creates: target/campusconnect-backend-1.0.0.jar
```

### Frontend (static files)

```bash
cd frontend
npm run build
# Creates: dist/ folder — upload to any static host
```

---

## Deployment Guide

### Option A: Render (Free Tier)

#### 1. Deploy PostgreSQL on Render

- Go to **render.com** → New → PostgreSQL
- Note the **Internal Database URL**

#### 2. Deploy Spring Boot Backend

- New → Web Service → Connect your GitHub repo
- **Root Directory:** `backend`
- **Build Command:** `./mvnw clean package -DskipTests`
- **Start Command:** `java -jar target/campusconnect-backend-1.0.0.jar`
- **Environment Variables:**
  ```
  SPRING_PROFILES_ACTIVE=prod
  DATABASE_URL=<your Render PostgreSQL URL>
  DB_USERNAME=<from Render>
  DB_PASSWORD=<from Render>
  ```

#### 3. Deploy React Frontend

- New → Static Site → Connect your GitHub repo
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  ```
  VITE_API_URL=https://your-backend.onrender.com/api/v1
  ```

---

### Option B: Vercel (Frontend) + Railway (Backend)

#### Frontend → Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

#### Backend → Railway

- railway.app → New Project → Deploy from GitHub
- Add PostgreSQL plugin
- Set env vars same as Render above

---

### Option C: Docker Compose (Self-Hosted)

Create `docker-compose.yml` at project root:

```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: campusconnect
      POSTGRES_USER: campusconnect
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DATABASE_URL: jdbc:postgresql://db:5432/campusconnect
      DB_USERNAME: campusconnect
      DB_PASSWORD: secret
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

Create `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests 2>/dev/null || mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_URL=http://localhost:8080/api/v1
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    location /api { proxy_pass http://backend:8080; }
}
```

#### Run with Docker

```bash
docker-compose up --build
```

App will be at: **http://localhost**

---

## Demo Accounts

| Role    | Email              | Password   |
| ------- | ------------------ | ---------- |
| Admin   | admin@campus.edu   | admin123   |
| Student | student@campus.edu | student123 |
| Faculty | faculty@campus.edu | faculty123 |

> These are seeded automatically in **dev** profile on first run.

---

## Tech Stack Summary (for Resume)

### Backend

- **Spring Boot 3.2** — REST API
- **Spring Security 6** — JWT-based stateless auth
- **Spring Data JPA + Hibernate** — ORM, JPQL queries
- **H2** (dev) / **PostgreSQL** (prod) — Database
- **Lombok + MapStruct** — Boilerplate reduction
- **Springdoc OpenAPI** — Auto-generated Swagger docs
- **Bean Validation** — DTO-level input validation
- **Layered Architecture** — Controller → Service → Repository

### Frontend

- **React 18** — Component-based UI
- **React Router v6** — Client-side routing with protected routes
- **Framer Motion** — Page transitions, micro-animations
- **Tailwind CSS** — Utility-first styling
- **Axios** — HTTP client with interceptors
- **date-fns** — Date formatting

---


