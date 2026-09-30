FROM node:26-alpine AS build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_BACKEND_URL=https://bsu-backend-1001832865956.europe-west1.run.app/api/v1
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm run build

FROM node:26-alpine AS final

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /build/dist ./dist
COPY server.js generateSitemap.js ./

ARG VITE_BACKEND_URL=https://bsu-backend-1001832865956.europe-west1.run.app/api/v1
ARG FRONTEND_URL=https://bsu-frontend-1001832865956.europe-west1.run.app
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV FRONTEND_URL=$FRONTEND_URL
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80

CMD ["node", "server.js"]
