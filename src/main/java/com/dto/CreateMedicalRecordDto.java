package com.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CreateMedicalRecordDto {
    private Long animalId;
    private LocalDate date;
    private String procedureType;
    private String diagnosis;
    private String treatment;
    private String notes;
    private String status;
    private Long veterinarianId;
}
