package com.crm.exception;

/** Thrown by services when a record does not exist, e.g. "Customer not found". Mapped to HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
