package com.repository;


import com.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findByNameContainingIgnoreCase(String name);
    List<Animal> findByType(String type);
    List<Animal> findByStatus(String status);
    List<Animal> findByOwnerNameContainingIgnoreCase(String ownerName);
}