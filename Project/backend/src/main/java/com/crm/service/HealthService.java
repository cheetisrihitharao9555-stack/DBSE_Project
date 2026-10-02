package com.crm.service;

import com.crm.dto.HealthResponse;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

/** Reports whether the API is running and whether MySQL answers a trivial query. */
@Service
public class HealthService {

    private static final Logger log = LoggerFactory.getLogger(HealthService.class);

    private final JdbcTemplate jdbcTemplate;
    private final String applicationName;

    public HealthService(JdbcTemplate jdbcTemplate,
                         @Value("${spring.application.name}") String applicationName) {
        this.jdbcTemplate = jdbcTemplate;
        this.applicationName = applicationName;
    }

    public HealthResponse check() {
        String database = isDatabaseUp() ? "UP" : "DOWN";
        return new HealthResponse(database, applicationName, database, Instant.now());
    }

    private boolean isDatabaseUp() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (DataAccessException ex) {
            log.warn("Database health check failed: {}", ex.getMessage());
            return false;
        }
    }
}
