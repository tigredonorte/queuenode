# Stage 1: Build stage
FROM node:20 AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

# Stage 2: Runtime stage
# Stage 2: Runtime stage
FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app

RUN npm run tsoa:spec

EXPOSE 3333