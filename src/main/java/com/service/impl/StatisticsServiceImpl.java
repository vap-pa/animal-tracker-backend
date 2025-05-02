package com.service.impl;

import com.dto.DashboardStatsDto;
import com.model.Enclosure;
import com.model.Staff;
import com.repository.AnimalRepository;
import com.repository.AppointmentRepository;
import com.repository.MedicalRecordRepository;
import com.repository.StaffRepository;
import com.repository.EnclosureRepository;
import com.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {
    private final AnimalRepository animalRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final StaffRepository staffRepository;
    private final EnclosureRepository enclosureRepository;

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

    @Override
    public byte[] generateReport(String reportType, String format) {
        if (!format.equalsIgnoreCase("xlsx")) {
            throw new IllegalArgumentException("Only XLSX format is supported at this time");
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Report");

            // Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            int rowNum = 0;
            Row headerRow = sheet.createRow(rowNum++);

            switch (reportType.toUpperCase()) {
                case "ANIMAL":
                    generateAnimalsReport(sheet, headerRow, headerStyle);
                    break;
                case "ENCLOSURE":
                    generateEnclosuresReport(sheet, headerRow, headerStyle);
                    break;
                case "STAFF":
                    generateStaffReport(sheet, headerRow, headerStyle);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid report type: " + reportType);
            }

            // Auto-size columns
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Error generating report", e);
        }
    }

    private void generateDashboardReport(Sheet sheet, Row headerRow, CellStyle headerStyle) {
        DashboardStatsDto stats = getDashboardStats();
        
        // Create headers
        String[] headers = {"Metric", "Value"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data
        int rowNum = 1;
        addRow(sheet, rowNum++, "Total Animals", stats.getTotalAnimals());
        addRow(sheet, rowNum++, "Total Appointments", stats.getTotalAppointments());
        addRow(sheet, rowNum++, "Total Medical Records", stats.getTotalMedicalRecords());
        addRow(sheet, rowNum++, "Total Staff", stats.getTotalStaff());
        addRow(sheet, rowNum++, "Emergency Cases", stats.getEmergencyCases());
        addRow(sheet, rowNum++, "Healthy Animals", stats.getHealthyAnimals());
        addRow(sheet, rowNum++, "Under Observation", stats.getUnderObservation());
        addRow(sheet, rowNum++, "Critical Cases", stats.getCriticalCases());
        addRow(sheet, rowNum++, "Healthy Percentage", stats.getHealthyPercentage());
    }

    private void generateAnimalsReport(Sheet sheet, Row headerRow, CellStyle headerStyle) {
        Map<String, Long> animalsByType = getAnimalsByType();
        
        // Create headers
        String[] headers = {"Animal Type", "Count"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data
        int rowNum = 1;
        for (Map.Entry<String, Long> entry : animalsByType.entrySet()) {
            addRow(sheet, rowNum++, entry.getKey(), entry.getValue());
        }
    }

    private void generateAppointmentsReport(Sheet sheet, Row headerRow, CellStyle headerStyle) {
        Map<String, Long> appointmentsByStatus = getAppointmentsByStatus();
        
        // Create headers
        String[] headers = {"Status", "Count"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data
        int rowNum = 1;
        for (Map.Entry<String, Long> entry : appointmentsByStatus.entrySet()) {
            addRow(sheet, rowNum++, entry.getKey(), entry.getValue());
        }
    }

    private void generateMedicalReport(Sheet sheet, Row headerRow, CellStyle headerStyle) {
        Map<String, Long> emergencyCases = getEmergencyCases();
        
        // Create headers
        String[] headers = {"Case Type", "Count"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data
        int rowNum = 1;
        for (Map.Entry<String, Long> entry : emergencyCases.entrySet()) {
            addRow(sheet, rowNum++, entry.getKey(), entry.getValue());
        }
    }

    private void generateEnclosuresReport(Sheet sheet, Row headerRow, CellStyle headerStyle) {
        List<Enclosure> enclosures = enclosureRepository.findAll();
        
        // Create headers
        String[] headers = {"Enclosure ID", "Name", "Type", "Capacity", "Current Occupancy", "Status"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data
        int rowNum = 1;
        for (Enclosure enclosure : enclosures) {
            addRow(sheet, rowNum++,
                enclosure.getId(),
                enclosure.getName(),
                enclosure.getType(),
                enclosure.getCapacity(),
                enclosure.getCurrentOccupancy(),
                enclosure.getStatus()
            );
        }
    }

    private void generateStaffReport(Sheet sheet, Row headerRow, CellStyle headerStyle) {
        List<Staff> staffList = staffRepository.findAll();
        
        // Create headers
        String[] headers = {"Staff ID", "Name", "Role", "Email", "Phone", "Specialization"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data
        int rowNum = 1;
        for (Staff staff : staffList) {
            addRow(sheet, rowNum++,
                staff.getId(),
                staff.getFirstName() + " " + staff.getLastName(),
                staff.getRole(),
                staff.getEmail(),
                staff.getPhone(),
                staff.getSpecialization()
            );
        }
    }

    private void addRow(Sheet sheet, int rowNum, Object... values) {
        Row row = sheet.createRow(rowNum);
        for (int i = 0; i < values.length; i++) {
            Cell cell = row.createCell(i);
            if (values[i] instanceof Number) {
                cell.setCellValue(((Number) values[i]).doubleValue());
            } else {
                cell.setCellValue(values[i] != null ? values[i].toString() : "");
            }
        }
    }
} 