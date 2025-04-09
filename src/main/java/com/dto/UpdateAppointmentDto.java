package com.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UpdateAppointmentDto {
    private LocalDateTime dateTime;
    private String type;
    private String description;
    private String status;
    private Long veterinarianId;
}