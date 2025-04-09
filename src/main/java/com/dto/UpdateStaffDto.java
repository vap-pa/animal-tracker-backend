package com.dto;

import lombok.Data;

@Data
public class UpdateStaffDto {
    private String firstName;
    private String lastName;
    private String role;
    private String email;
    private String phone;
    private String specialization;
    private boolean active;
}