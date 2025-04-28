package com.mapper;

import com.dto.MedicalRecordDto;
import com.dto.CreateMedicalRecordDto;
import com.dto.UpdateMedicalRecordDto;
import com.model.MedicalRecord;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface MedicalRecordMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "animal.id", source = "animalId")
    @Mapping(target = "veterinarian.id", source = "veterinarianId")
    MedicalRecord toEntity(CreateMedicalRecordDto createMedicalRecordDto);
    
    @Mapping(target = "animalId", source = "animal.id")
    @Mapping(target = "veterinarianId", source = "veterinarian.id")
    @Mapping(target = "veterinarianName", expression = "java(medicalRecord.getVeterinarian().getFirstName() + \" \" + medicalRecord.getVeterinarian().getLastName())")
    MedicalRecordDto toDto(MedicalRecord medicalRecord);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "animal", ignore = true)
    @Mapping(target = "veterinarian.id", source = "veterinarianId")
    void updateEntity(UpdateMedicalRecordDto updateMedicalRecordDto, @MappingTarget MedicalRecord medicalRecord);
}