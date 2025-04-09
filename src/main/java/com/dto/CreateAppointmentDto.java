package com.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CreateAppointmentDto {
    private Long animalId;
    private LocalDateTime dateTime;
    private String type;
    private String description;
    private String status;
    private Long veterinarianId;
}
