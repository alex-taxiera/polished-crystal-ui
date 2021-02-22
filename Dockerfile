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

# configs for backend runtime
COPY ./babel.config.js ./
COPY ./config ./config

# source files for backend
COPY ./src/server ./src/server
COPY ./src/index.js ./src/index.js

# prod only packages - move installer to app once git and ssh is not required
COPY --from=installer ./node_modules ./node_modules

# webpack build
COPY --from=builder ./dist ./dist

CMD ["node", "src"]
