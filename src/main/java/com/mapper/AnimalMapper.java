package com.mapper;

import com.dto.AnimalDto;
import com.dto.CreateAnimalDto;
import com.dto.UpdateAnimalDto;
import com.model.Animal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {MedicalRecordMapper.class, AppointmentMapper.class, UserMapper.class})
public interface AnimalMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "medicalRecords", ignore = true)
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "admissionDate", ignore = true)
    @Mapping(target = "owner", source = "ownerId", qualifiedByName = "idToUser")
    @Mapping(target = "imageUrl", source = "imageUrl")
    Animal toEntity(CreateAnimalDto createAnimalDto);
    
    @Mapping(target = "medicalRecords", source = "medicalRecords")
    @Mapping(target = "appointments", source = "appointments")
    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerUsername", source = "owner.username")
    @Mapping(target = "imageUrl", source = "imageUrl")
    AnimalDto toDto(Animal animal);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "medicalRecords", ignore = true)
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "admissionDate", ignore = true)
    void updateEntity(UpdateAnimalDto updateAnimalDto, @MappingTarget Animal animal);
}