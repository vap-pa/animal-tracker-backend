package com.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dto.CreateMedicalRecordDto;
import com.dto.MedicalRecordDto;
import com.dto.UpdateMedicalRecordDto;
import com.exception.ResourceNotFoundException;
import com.mapper.MedicalRecordMapper;
import com.model.MedicalRecord;
import com.repository.MedicalRecordRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordMapper medicalRecordMapper;
    private final AnimalService animalService;
    private final StaffService staffService;

    public List<MedicalRecordDto> getAllMedicalRecords() {
        return medicalRecordRepository.findAll().stream()
                .map(medicalRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    public MedicalRecordDto getMedicalRecordById(Long id) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));
        return medicalRecordMapper.toDto(medicalRecord);
    }

    public List<MedicalRecordDto> getMedicalRecordsByAnimalId(Long animalId) {
        animalService.getAnimalById(animalId); // Check if animal exists
        return medicalRecordRepository.findByAnimalId(animalId).stream()
                .map(medicalRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    public MedicalRecordDto createMedicalRecord(CreateMedicalRecordDto createMedicalRecordDto) {
        MedicalRecord medicalRecord = medicalRecordMapper.toEntity(createMedicalRecordDto);
        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);
        return medicalRecordMapper.toDto(savedRecord);
    }

    public MedicalRecordDto updateMedicalRecord(Long id, UpdateMedicalRecordDto updateMedicalRecordDto) {
        MedicalRecord existingRecord = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));

        medicalRecordMapper.updateEntity(updateMedicalRecordDto, existingRecord);
        MedicalRecord updatedRecord = medicalRecordRepository.save(existingRecord);
        return medicalRecordMapper.toDto(updatedRecord);
    }

    public void deleteMedicalRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medical record not found with id: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }
}