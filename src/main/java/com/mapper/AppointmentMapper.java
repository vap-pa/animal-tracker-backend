package com.mapper;

import com.dto.AppointmentDto;
import com.dto.CreateAppointmentDto;
import com.dto.UpdateAppointmentDto;
import com.model.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AppointmentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "animal.id", source = "animalId")
    @Mapping(target = "veterinarian.id", source = "veterinarianId")
    Appointment toEntity(CreateAppointmentDto createAppointmentDto);
    
    @Mapping(target = "animalId", source = "animal.id")
    @Mapping(target = "animalName", source = "animal.name")
    @Mapping(target = "veterinarianId", source = "veterinarian.id")
    @Mapping(target = "veterinarianName", expression = "java(appointment.getVeterinarian().getFirstName() + \" \" + appointment.getVeterinarian().getLastName())")
    AppointmentDto toDto(Appointment appointment);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "animal", ignore = true)
    @Mapping(target = "veterinarian.id", source = "veterinarianId")
    void updateEntity(UpdateAppointmentDto updateAppointmentDto, @MappingTarget Appointment appointment);
}