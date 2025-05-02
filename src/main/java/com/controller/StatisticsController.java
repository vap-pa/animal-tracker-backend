package com.controller;

import com.dto.DashboardStatsDto;
import com.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Statistics and analytics APIs")
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(statisticsService.getDashboardStats());
    }

    @GetMapping("/animals/by-type")
    @Operation(summary = "Get animal count by type")
    public ResponseEntity<Map<String, Long>> getAnimalsByType() {
        return ResponseEntity.ok(statisticsService.getAnimalsByType());
    }

    @GetMapping("/appointments/by-status")
    @Operation(summary = "Get appointment count by status")
    public ResponseEntity<Map<String, Long>> getAppointmentsByStatus() {
        return ResponseEntity.ok(statisticsService.getAppointmentsByStatus());
    }

    @GetMapping("/emergency-cases")
    @Operation(summary = "Get current emergency cases")
    public ResponseEntity<Map<String, Long>> getEmergencyCases() {
        return ResponseEntity.ok(statisticsService.getEmergencyCases());
    }

    @GetMapping("/export")
    @Operation(summary = "Export statistics report")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam String reportType,
            @RequestParam(defaultValue = "xlsx") String format) {
        byte[] reportBytes = statisticsService.generateReport(reportType, format);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "report.xlsx");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(reportBytes);
    }
} 