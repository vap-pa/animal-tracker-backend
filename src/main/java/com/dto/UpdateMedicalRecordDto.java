package com.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UpdateMedicalRecordDto {
    private LocalDate date;
    private String procedureType;
    private String diagnosis;
    private String treatment;
    private String notes;
    private String status;
    private Long veterinarianId;
}