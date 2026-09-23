FROM node:26-alpine AS build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_BACKEND_URL=https://bsu-backend-1001832865956.europe-west1.run.app/api/v1
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm run build

FROM nginx:alpine AS final

COPY --from=build /build/dist /usr/share/nginx/html

EXPOSE 80
