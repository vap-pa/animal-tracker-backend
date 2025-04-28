package com.service.impl;

import com.dto.DashboardStatsDto;
import com.repository.AnimalRepository;
import com.repository.AppointmentRepository;
import com.repository.MedicalRecordRepository;
import com.repository.StaffRepository;
import com.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {
    private final AnimalRepository animalRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final StaffRepository staffRepository;

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalAnimals = animalRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalMedicalRecords = medicalRecordRepository.count();
        long totalStaff = staffRepository.count();
        
        long emergencyCases = appointmentRepository.countByStatus("Emergency");
        long criticalCases = medicalRecordRepository.countByStatus("Critical");
        long underObservation = medicalRecordRepository.countByStatus("Under Observation");
        long healthyAnimals = totalAnimals - criticalCases - underObservation;
        double healthyPercentage = totalAnimals > 0 ? (healthyAnimals * 100.0) / totalAnimals : 0;

        return DashboardStatsDto.builder()
                .totalAnimals(totalAnimals)
                .totalAppointments(totalAppointments)
                .totalMedicalRecords(totalMedicalRecords)
                .totalStaff(totalStaff)
                .emergencyCases(emergencyCases)
                .healthyAnimals(healthyAnimals)
                .underObservation(underObservation)
                .criticalCases(criticalCases)
                .healthyPercentage(healthyPercentage)
                .build();
    }

    @Override
    public Map<String, Long> getAnimalsByType() {
        return animalRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        animal -> animal.getType(),
                        Collectors.counting()
                ));
    }

    @Override
    public Map<String, Long> getAppointmentsByStatus() {
        return appointmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getStatus(),
                        Collectors.counting()
                ));
    }

    @Override
    public Map<String, Long> getEmergencyCases() {
        return Map.of(
                "Emergency", appointmentRepository.countByStatus("Emergency"),
                "Critical", medicalRecordRepository.countByStatus("Critical")
        );
    }
} 