package com.service;



import com.dto.AnimalDto;
import com.dto.CreateAnimalDto;
import com.dto.UpdateAnimalDto;
import com.exception.ResourceNotFoundException;
import com.mapper.AnimalMapper;
import com.model.Animal;
import com.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.model.User;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnimalService {
    private final AnimalRepository animalRepository;
    private final AnimalMapper animalMapper;

    public List<AnimalDto> getAllAnimals() {
        return animalRepository.findAll().stream()
            .map(animalMapper::toDto)
            .collect(Collectors.toList());
    }

    public AnimalDto getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found with id: " + id));
        return animalMapper.toDto(animal);
    }

    public AnimalDto createAnimal(CreateAnimalDto createAnimalDto) {
        Animal animal = animalMapper.toEntity(createAnimalDto);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            animal.setOwner(user);
        } else if (createAnimalDto.getOwnerId() != null) {
            // For admin use
            User owner = new User();
            owner.setId(createAnimalDto.getOwnerId());
            animal.setOwner(owner);
        }
        Animal savedAnimal = animalRepository.save(animal);
        return animalMapper.toDto(savedAnimal);
    }

    public AnimalDto updateAnimal(Long id, UpdateAnimalDto updateAnimalDto) {
        Animal existingAnimal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found with id: " + id));

        animalMapper.updateEntity(updateAnimalDto, existingAnimal);
        Animal updatedAnimal = animalRepository.save(existingAnimal);
        return animalMapper.toDto(updatedAnimal);
    }

    public void deleteAnimal(Long id) {
        if (!animalRepository.existsById(id)) {
            throw new ResourceNotFoundException("Animal not found with id: " + id);
        }
        animalRepository.deleteById(id);
    }

    public List<AnimalDto> searchAnimals(String name, String type, String status, String ownerName) {
        if (name != null) {
            return animalRepository.findByNameContainingIgnoreCase(name).stream()
                    .map(animalMapper::toDto)
                    .collect(Collectors.toList());
        } else if (type != null) {
            return animalRepository.findByType(type).stream()
                    .map(animalMapper::toDto)
                    .collect(Collectors.toList());
        } else if (status != null) {
            return animalRepository.findByStatus(status).stream()
                    .map(animalMapper::toDto)
                    .collect(Collectors.toList());
        } else if (ownerName != null) {
            return animalRepository.findByOwnerNameContainingIgnoreCase(ownerName).stream()
                    .map(animalMapper::toDto)
                    .collect(Collectors.toList());
        } else {
            return getAllAnimals();
        }
    }
}