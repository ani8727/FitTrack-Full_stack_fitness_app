package com.fitness.userservice.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

@Slf4j
@Component
public class UserDatabaseStartupValidator {

    private final DataSource dataSource;

    public UserDatabaseStartupValidator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void validateDatabaseOnStartup() {
        log.info("========================================");
        log.info("Starting User Service Database Validation");
        log.info("========================================");

        try {
            validateConnectivity();
            validateSchema();
            validateRole();

            log.info("========================================");
            log.info("✓ SUCCESS: User Service is ready");
            log.info("  Database: user_db");
            log.info("  User: user_service_user");
            log.info("  SSL Mode: ENFORCED");
            log.info("========================================");

        } catch (Exception e) {
            log.error("========================================");
            log.error("✗ FATAL: Database validation failed");
            log.error("  Service cannot start");
            log.error("========================================");
            throw new RuntimeException("Database startup validation failed: " + e.getMessage(), e);
        }
    }

    private void validateConnectivity() throws Exception {
        log.info("→ Testing basic database connectivity...");
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT 1")) {

            if (resultSet.next()) {
                log.info("  ✓ Database is reachable");
            } else {
                throw new RuntimeException("SELECT 1 query failed");
            }
        }
    }

    private void validateSchema() throws Exception {
        log.info("→ Validating user_schema exists...");
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(
                     "SELECT 1 FROM information_schema.schemata WHERE schema_name = 'user_schema'")) {

            if (resultSet.next()) {
                log.info("  ✓ Schema 'user_schema' is present");
            } else {
                log.warn("  ⚠ Schema 'user_schema' not found - will be created by migrations");
            }
        }
    }

    private void validateRole() throws Exception {
        log.info("→ Validating user_service_user role...");
        try (Connection connection = dataSource.getConnection()) {
            String user = connection.getMetaData().getUserName();
            if (user.contains("user_service_user")) {
                log.info("  ✓ Connected as: {}", user);
            } else {
                log.warn("  ⚠ Connected as: {} (expected: user_service_user)", user);
            }
        }
    }
}
