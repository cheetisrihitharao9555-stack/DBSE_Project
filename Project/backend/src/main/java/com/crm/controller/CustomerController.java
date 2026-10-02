package com.crm.controller;

import com.crm.dto.CustomerRequest;
import com.crm.dto.CustomerResponse;
import com.crm.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                customerService.createCustomer(
                        request,
                        authentication.getName()
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getCustomers(
            Authentication authentication) {

        return ResponseEntity.ok(
                customerService.getCustomers(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomer(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                customerService.getCustomer(
                        id,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                customerService.updateCustomer(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Long id,
            Authentication authentication) {

        customerService.deleteCustomer(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}