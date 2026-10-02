package com.crm.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.crm.dto.HealthResponse;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.jdbc.core.JdbcTemplate;

class HealthServiceTest {

    @Test
    void reportsUpWhenDatabaseAnswers() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        when(jdbc.queryForObject("SELECT 1", Integer.class)).thenReturn(1);

        HealthResponse response = new HealthService(jdbc, "crm-backend").check();

        assertEquals("UP", response.status());
        assertEquals("UP", response.database());
    }

    @Test
    void reportsDownWhenDatabaseFails() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        when(jdbc.queryForObject("SELECT 1", Integer.class))
                .thenThrow(new DataAccessResourceFailureException("connection refused"));

        HealthResponse response = new HealthService(jdbc, "crm-backend").check();

        assertEquals("DOWN", response.status());
        assertEquals("DOWN", response.database());
    }
}
