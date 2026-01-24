# ---------- BUILD STAGE ----------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn -B -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests clean package


# ---------- RUNTIME STAGE ----------
FROM eclipse-temurin:21-jre

# Render will inject PORT dynamically
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xmx384m -Xms256m -XX:+UseSerialGC -XX:MaxMetaspaceSize=128m -XX:CompressedClassSpaceSize=32m -Xss512k -XX:+TieredCompilation -XX:TieredStopAtLevel=1"

WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar

# Render dynamically maps the port – DO NOT hardcode
EXPOSE 8082

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$PORT -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar"]
