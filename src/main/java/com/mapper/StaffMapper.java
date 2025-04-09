package com.mapper;


import com.dto.StaffDto;
import com.dto.CreateStaffDto;
import com.dto.UpdateStaffDto;
import com.model.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface StaffMapper {
    Staff toEntity(CreateStaffDto createStaffDto);
    StaffDto toDto(Staff staff);
    void updateEntity(UpdateStaffDto updateStaffDto, @MappingTarget Staff staff);
}