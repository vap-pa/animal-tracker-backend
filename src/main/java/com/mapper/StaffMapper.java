package com.mapper;

import com.dto.StaffDto;
import com.dto.CreateStaffDto;
import com.dto.UpdateStaffDto;
import com.model.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface StaffMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    Staff toEntity(CreateStaffDto createStaffDto);
    
    StaffDto toDto(Staff staff);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "hireDate", ignore = true)
    void updateEntity(UpdateStaffDto updateStaffDto, @MappingTarget Staff staff);
}