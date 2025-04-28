package com.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalAnimals;
    private long totalAppointments;
    private long totalMedicalRecords;
    private long totalStaff;
    private long emergencyCases;
    private long healthyAnimals;
    private long underObservation;
    private long criticalCases;
    private double healthyPercentage;
} 