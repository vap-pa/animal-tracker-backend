package com.dto;


import lombok.Data;

import java.time.LocalDate;

@Data
public class MedicalRecordDto {
    private Long id;
    private Long animalId;
    private LocalDate date;
    private String procedureType;
    private String diagnosis;
    private String treatment;
    private String notes;
    private Long veterinarianId;
    private String veterinarianName;
}
