package com.dto;


import lombok.Data;

import java.time.LocalDate;

@Data
public class StaffDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String role;
    private String email;
    private String phone;
    private String specialization;
    private LocalDate hireDate;
    private boolean active;
}
