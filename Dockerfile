# syntax=docker/dockerfile:1.0.0-experimental

FROM node:fermium-slim as builder

COPY ./package*.json ./

RUN apt-get update -yq && \
    apt-get install -yq --no-install-recommends \
      git openssh-client && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts
RUN --mount=type=ssh npm ci

COPY . .

RUN npm run build

FROM node:fermium-slim AS installer

COPY ./package*.json ./

RUN apt-get update -yq && \
    apt-get install -yq --no-install-recommends \
      git openssh-client && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts
RUN --mount=type=ssh npm ci --no-optional --only=prod

FROM node:fermium-slim AS app

EXPOSE 3030

WORKDIR /app

COPY --from=installer ./node_modules ./node_modules
COPY --from=builder ./build ./
COPY --from=builder ./dist ./dist

CMD ["node", "lib/server/index.js"]
