package com.crm.dto;

import java.time.Instant;

/** Body returned by GET /api/health. */
public record HealthResponse(String status, String application, String database, Instant timestamp) {
}
