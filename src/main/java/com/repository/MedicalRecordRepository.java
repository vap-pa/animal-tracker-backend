package com.repository;


import com.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByAnimalId(Long animalId);
    List<MedicalRecord> findByProcedureTypeContainingIgnoreCase(String procedureType);
    long countByStatus(String status);
}