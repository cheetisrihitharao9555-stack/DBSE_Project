package com.crm.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crm.entity.Customer;
import com.crm.entity.User;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByUserOrderByCreatedAtDesc(User user);

    Optional<Customer> findByIdAndUser(Long id, User user);
}