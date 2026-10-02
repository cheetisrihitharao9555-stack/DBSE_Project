package com.crm.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.crm.dto.CustomerRequest;
import com.crm.dto.CustomerResponse;
import com.crm.entity.Customer;
import com.crm.entity.User;
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerService(
            CustomerRepository customerRepository,
            UserRepository userRepository) {

        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public CustomerResponse createCustomer(
            CustomerRequest request,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Customer customer = new Customer(
                user,
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getCompany()
        );

        Customer saved = customerRepository.save(customer);

        return toResponse(saved);
    }

    public List<CustomerResponse> getCustomers(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return customerRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CustomerResponse getCustomer(
            Long id,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Customer customer = customerRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        return toResponse(customer);
    }

    public CustomerResponse updateCustomer(
            Long id,
            CustomerRequest request,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Customer customer = customerRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setCompany(request.getCompany());

        return toResponse(customerRepository.save(customer));
    }

    public void deleteCustomer(
            Long id,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Customer customer = customerRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        customerRepository.delete(customer);
    }

    private CustomerResponse toResponse(Customer customer) {

        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getCompany(),
                customer.getStatus()
        );
    }
}