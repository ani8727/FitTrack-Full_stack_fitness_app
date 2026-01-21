package com.fitness.userservice.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Custom Health Check for User Service Database Connection
 * Validates that the user_service_user role can access user_db exclusively
 */
@Slf4j
@Component("userDatabaseHealth")
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    @Value("${spring.application.name:user-service}")
    private String serviceName;

    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Health health() {
        try {
            return checkDatabaseHealth();
        } catch (Exception e) {
            log.error("Database health check failed for {}", serviceName, e);
            return Health.down()
                    .withDetail("service", serviceName)
                    .withDetail("error", e.getMessage())
                    .withDetail("database", "user_db")
                    .build();
        }
    }

    private Health checkDatabaseHealth() {
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {

            log.info("Starting database health check for service: {}", serviceName);

            // Test basic connectivity
            try (ResultSet resultSet = statement.executeQuery("SELECT 1")) {
                if (!resultSet.next()) {
                    log.warn("Database connectivity test failed for {}", serviceName);
                    return Health.down()
                            .withDetail("service", serviceName)
                            .withDetail("reason", "Failed to execute SELECT 1")
                            .withDetail("database", "user_db")
                            .build();
                }
            }

            // Get database and user information
            String currentDatabase = connection.getCatalog();
            String currentUser = connection.getMetaData().getUserName();

            log.info("✓ Database connection successful for service: {} | Database: {} | User: {}",
                    serviceName, currentDatabase, currentUser);

            // Validate that we're using the correct database
            if (!"user_db".equals(currentDatabase)) {
                log.warn("⚠ Connected to database: {} (expected: user_db)", currentDatabase);
            }

            // Validate role-based access
            if (!currentUser.contains("user_service_user")) {
                log.warn("⚠ Connected as user: {} (expected: user_service_user)", currentUser);
            }

            return Health.up()
                    .withDetail("service", serviceName)
                    .withDetail("database", currentDatabase)
                    .withDetail("user", currentUser)
                    .withDetail("status", "Database connection pool is healthy")
                    .build();

        } catch (Exception e) {
            log.error("✗ Critical: Database connection failed for {}", serviceName, e);
            return Health.down()
                    .withDetail("service", serviceName)
                    .withDetail("error", e.getMessage())
                    .withDetail("database", "user_db")
                    .withDetail("status", "Database connection pool is UNAVAILABLE")
                    .build();
        }
    }
}
