# syntax=docker/dockerfile:1

# ---- Frontend build ----
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ---- Backend build ----
FROM maven:3.9-eclipse-temurin-21 AS backend-builder
WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

COPY backend/src ./src
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

RUN mvn -q -DskipTests clean package

# ---- Runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=backend-builder /app/backend/target/backend-1.0.0.jar ./app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
