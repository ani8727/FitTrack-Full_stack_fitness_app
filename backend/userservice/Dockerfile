# Stage 1: Build
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xmx384m -Xms256m -XX:+UseSerialGC -XX:MaxMetaspaceSize=128m -XX:CompressedClassSpaceSize=32m -Xss512k -XX:+TieredCompilation -XX:TieredStopAtLevel=1"
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -Dserver.port=${PORT:-8081} -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar"]
