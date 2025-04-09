package com.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UpdateAnimalDto {
    private String name;
    private String type;
    private String breed;
    private Integer age;
    private String status;
    private Double weight;
    private String microchipNumber;
    private LocalDate birthDate;
    private String ownerName;
    private String ownerContact;
}