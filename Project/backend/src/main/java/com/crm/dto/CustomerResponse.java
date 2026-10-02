package com.crm.dto;

public class CustomerResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String status;

    public CustomerResponse(Long id, String name, String email,
                             String phone, String company, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.company = company;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getCompany() {
        return company;
    }

    public String getStatus() {
        return status;
    }
}