package com.controller;

import com.dto.MedicalRecordDto;
import com.dto.CreateMedicalRecordDto;
import com.dto.UpdateMedicalRecordDto;
import com.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@Tag(name = "Medical Records", description = "Medical record management APIs")
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;

    @GetMapping
    @Operation(summary = "Get all medical records")
    public ResponseEntity<List<MedicalRecordDto>> getAllMedicalRecords() {
        List<MedicalRecordDto> records = medicalRecordService.getAllMedicalRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get medical record by ID")
    public ResponseEntity<MedicalRecordDto> getMedicalRecordById(@PathVariable Long id) {
        MedicalRecordDto record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/animal/{animalId}")
    @Operation(summary = "Get medical records by animal ID")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecordsByAnimalId(@PathVariable Long animalId) {
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsByAnimalId(animalId);
        return ResponseEntity.ok(records);
    }

    @PostMapping
    @Operation(summary = "Create a new medical record")
    public ResponseEntity<MedicalRecordDto> createMedicalRecord(
            @Valid @RequestBody CreateMedicalRecordDto createMedicalRecordDto) {
        MedicalRecordDto createdRecord = medicalRecordService.createMedicalRecord(createMedicalRecordDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRecord);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing medical record")
    public ResponseEntity<MedicalRecordDto> updateMedicalRecord(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMedicalRecordDto updateMedicalRecordDto) {
        MedicalRecordDto updatedRecord = medicalRecordService.updateMedicalRecord(id, updateMedicalRecordDto);
        return ResponseEntity.ok(updatedRecord);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a medical record")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
}