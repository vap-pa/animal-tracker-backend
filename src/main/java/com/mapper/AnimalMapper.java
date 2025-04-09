package com.mapper;


import com.dto.AnimalDto;
import com.dto.CreateAnimalDto;
import com.dto.UpdateAnimalDto;
import com.model.Animal;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", 
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AnimalMapper {
    Animal toEntity(CreateAnimalDto createAnimalDto);
    AnimalDto toDto(Animal animal);
    void updateEntity(UpdateAnimalDto updateAnimalDto, @MappingTarget Animal animal);
}