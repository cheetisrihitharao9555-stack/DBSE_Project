package com.crm.dto;

import java.time.Instant;

/** Structured error body returned for every failed request. */
public record ApiError(boolean success, String message, Instant timestamp, int status) {

    public static ApiError of(int status, String message) {
        return new ApiError(false, message, Instant.now(), status);
    }
}
