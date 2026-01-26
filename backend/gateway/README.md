# FitTrack Gateway

FitTrack Gateway is a Spring Cloud Gateway application designed to serve as the entry point for the FitTrack microservices architecture. This gateway handles routing, security, and API documentation for the various microservices that comprise the FitTrack system.

## Features

- **Routing**: Configured to route requests to various microservices based on defined paths.
- **Security**: Implements JWT validation for secure access to the API endpoints.
- **CORS Configuration**: Allows cross-origin requests from specified origins.
- **API Documentation**: Integrated with Swagger for easy access to API documentation.
- **Health Check**: Provides a health check endpoint to monitor the status of the gateway.

## Project Structure

```
fittrack-gateway
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── fittrack
│   │   │           └── gateway
│   │   │               ├── GatewayApplication.java
│   │   │               ├── config
│   │   │               │   ├── GatewayConfig.java
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   ├── CorsConfig.java
│   │   │               │   └── SwaggerConfig.java
│   │   │               └── controller
│   │   │                   └── HealthController.java
│   │   └── resources
│   │       ├── application.yml
│   │       ├── application-prod.yml
│   │       └── bootstrap.yml
│   └── test
│       └── java
│           └── com
│               └── fittrack
│                   └── gateway
│                       └── GatewayApplicationTests.java
├── mvnw
├── mvnw.cmd
├── pom.xml
└── Dockerfile
```

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ani8727/FitTrack-Full_stack_fitness_app.git
   cd fittrack-gateway
   ```

2. **Build the Project**:
   Use Maven to build the project:
   ```bash
   ./mvnw clean install
   ```

3. **Run the Application**:
   You can run the application using:
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access the API**:
   The gateway will be available at `http://localhost:8080`. You can access the Swagger UI at `http://localhost:8080/swagger-ui.html`.

## Environment Variables

- `AUTH0_JWK_SET_URI`: URI for JWT validation.
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS.

## Docker

To build and run the application in a Docker container, use the following commands:

1. **Build the Docker Image**:
   ```bash
   docker build -t fittrack-gateway .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -p 8080:8080 fittrack-gateway
   ```

## Testing

Unit tests are included in the project to ensure the application context loads correctly. You can run the tests using:
```bash
./mvnw test
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.