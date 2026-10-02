package com.crm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crm.entity.LoginHistory;
import com.crm.entity.User;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

    List<LoginHistory> findByUserOrderByLoginTimeDesc(User user);
}