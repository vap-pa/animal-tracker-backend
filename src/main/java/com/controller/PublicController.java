package com.controller;

import com.dto.DashboardStatsDto;
import com.service.StatisticsService;
import com.service.AnimalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public Information", description = "Public information APIs")
public class PublicController {
    private final StatisticsService statisticsService;
    private final AnimalService animalService;

    @GetMapping("/home")
    @Operation(summary = "Get public home page information")
    public ResponseEntity<Map<String, Object>> getPublicHomeInfo() {
        DashboardStatsDto stats = statisticsService.getDashboardStats();
        Map<String, Long> animalsByType = statisticsService.getAnimalsByType();
        Map<String, Long> emergencyCases = statisticsService.getEmergencyCases();

        Map<String, Object> response = Map.of(
            "totalAnimals", stats.getTotalAnimals(),
            "healthyAnimals", stats.getHealthyAnimals(),
            "underObservation", stats.getUnderObservation(),
            "criticalCases", stats.getCriticalCases(),
            "animalsByType", animalsByType,
            "emergencyCases", emergencyCases
        );

        return ResponseEntity.ok(response);
    }
} 