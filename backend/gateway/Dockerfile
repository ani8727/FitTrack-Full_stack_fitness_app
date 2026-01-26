FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
ENV JAVA_OPTS=""
EXPOSE 8085
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dspring.profiles.active=prod -jar app.jar"]
