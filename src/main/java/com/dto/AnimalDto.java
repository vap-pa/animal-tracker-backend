package com.dto;


import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AnimalDto {
    private Long id;
    private String name;
    private String type;
    private String breed;
    private Integer age;
    private String status;
    private Double weight;
    private String microchipNumber;
    private LocalDate birthDate;
    private LocalDate admissionDate;
    private String ownerName;
    private String ownerContact;
    private Long ownerId;
    private String ownerUsername;
    private String imageUrl;
    private List<MedicalRecordDto> medicalRecords;
    private List<AppointmentDto> appointments;
}
