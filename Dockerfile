FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# copia só o backend
COPY backend ./backend

WORKDIR /app/backend

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]