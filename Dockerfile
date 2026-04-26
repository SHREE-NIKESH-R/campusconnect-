# BUILD STAGE (Java 21)
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY backend /app

RUN mvn clean package -DskipTests

# RUN STAGE (Java 21)
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]