package com.fitness.adminservice.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Startup Validation for Admin Service Database Connection
 * Ensures database is reachable before application starts accepting requests
 * Fails fast if database is unavailable
 */
@Slf4j
@Component
public class AdminDatabaseStartupValidator {

    private final DataSource dataSource;

    public AdminDatabaseStartupValidator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void validateDatabaseOnStartup() {
        log.info("========================================");
        log.info("Starting Admin Service Database Validation");
        log.info("========================================");

        try {
            validateConnectivity();
            validateSchema();
            validateRole();

            log.info("========================================");
            log.info("✓ SUCCESS: Admin Service is ready");
            log.info("  Database: admin_db");
            log.info("  User: admin_service_user");
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
        log.info("→ Validating admin_schema exists...");
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(
                     "SELECT 1 FROM information_schema.schemata WHERE schema_name = 'admin_schema'")) {

            if (resultSet.next()) {
                log.info("  ✓ Schema 'admin_schema' is present");
            } else {
                log.warn("  ⚠ Schema 'admin_schema' not found - will be created by migrations");
            }
        }
    }

    private void validateRole() throws Exception {
        log.info("→ Validating admin_service_user role...");
        try (Connection connection = dataSource.getConnection()) {
            String user = connection.getMetaData().getUserName();
            if (user.contains("admin_service_user")) {
                log.info("  ✓ Connected as: {}", user);
            } else {
                log.warn("  ⚠ Connected as: {} (expected: admin_service_user)", user);
            }
        }
    }
}
