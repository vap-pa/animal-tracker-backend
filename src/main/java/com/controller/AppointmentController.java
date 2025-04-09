package com.controller;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dto.CreateAppointmentDto;
import com.dto.UpdateAppointmentDto;
import com.dto.AppointmentDto;
import com.service.AppointmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointments", description = "Appointment management APIs")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping
    @Operation(summary = "Get all appointments or filter by parameters")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments(
            @RequestParam(required = false) Long animalId,
            @RequestParam(required = false) Long veterinarianId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(required = false) String status) {
        if (animalId != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByAnimalId(animalId));
        } else if (veterinarianId != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByVeterinarianId(veterinarianId));
        } else if (start != null && end != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByDateRange(start, end));
        } else if (status != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
        } else {
            return ResponseEntity.ok(appointmentService.getAllAppointments());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment by ID")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable Long id) {
        AppointmentDto appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @PostMapping
    @Operation(summary = "Create a new appointment")
    public ResponseEntity<AppointmentDto> createAppointment(
            @Valid @RequestBody CreateAppointmentDto createAppointmentDto) {
        AppointmentDto createdAppointment = appointmentService.createAppointment(createAppointmentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing appointment")
    public ResponseEntity<AppointmentDto> updateAppointment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAppointmentDto updateAppointmentDto) {
        AppointmentDto updatedAppointment = appointmentService.updateAppointment(id, updateAppointmentDto);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an appointment")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}