package com.service;

import com.dto.DashboardStatsDto;
import java.util.Map;

public interface StatisticsService {
    DashboardStatsDto getDashboardStats();
    Map<String, Long> getAnimalsByType();
    Map<String, Long> getAppointmentsByStatus();
    Map<String, Long> getEmergencyCases();
    byte[] generateReport(String reportType, String format);
} 