package com.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CreateStaffDto {
    private String firstName;
    private String lastName;
    private String role;
    private String email;
    private String phone;
    private String specialization;
    private LocalDate hireDate;
}
