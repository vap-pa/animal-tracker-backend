package com.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private Long id;
    private Long animalId;
    private String animalName;
    private LocalDateTime dateTime;
    private String type;
    private String description;
    private String status;
    private Long veterinarianId;
    private String veterinarianName;
}
