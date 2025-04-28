package com.controller;


import com.dto.AnimalDto;
import com.dto.CreateAnimalDto;
import com.dto.UpdateAnimalDto;
import com.service.AnimalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
@Tag(name = "Animals", description = "Animal management APIs")
public class AnimalController {
    private final AnimalService animalService;

    @GetMapping
    @Operation(summary = "Get all animals or search animals")
    public ResponseEntity<List<AnimalDto>> getAllAnimals(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ownerName) {
        try {
            List<AnimalDto> animals = animalService.searchAnimals(name, type, status, ownerName);
            return ResponseEntity.ok(animals != null ? animals : Collections.emptyList());
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get animal by ID")
    public ResponseEntity<AnimalDto> getAnimalById(@PathVariable Long id) {
        AnimalDto animal = animalService.getAnimalById(id);
        return ResponseEntity.ok(animal);
    }

    @PostMapping
    @Operation(summary = "Create a new animal")
    public ResponseEntity<AnimalDto> createAnimal(@Valid @RequestBody CreateAnimalDto createAnimalDto) {
        AnimalDto createdAnimal = animalService.createAnimal(createAnimalDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAnimal);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing animal")
    public ResponseEntity<AnimalDto> updateAnimal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAnimalDto updateAnimalDto) {
        AnimalDto updatedAnimal = animalService.updateAnimal(id, updateAnimalDto);
        return ResponseEntity.ok(updatedAnimal);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an animal")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        animalService.deleteAnimal(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadAnimalImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadsDir = System.getProperty("user.dir") + "/uploads/";
            Files.createDirectories(Paths.get(uploadsDir));
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadsDir, filename);
            Files.write(filePath, file.getBytes());
            String imageUrl = "/uploads/" + filename;
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload image");
        }
    }
}