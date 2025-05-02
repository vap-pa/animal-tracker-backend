package com.repository;

import com.model.Enclosure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnclosureRepository extends JpaRepository<Enclosure, Long> {
    List<Enclosure> findByType(String type);
    List<Enclosure> findByStatus(String status);
    List<Enclosure> findByCurrentOccupancyLessThan(int capacity);
} 