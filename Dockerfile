FROM node:16.19.1-bullseye AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM node:16.19.1-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY --from=build /app/dist/qualifier ./dist/qualifier

EXPOSE 8080
CMD ["node", "server.js"]
