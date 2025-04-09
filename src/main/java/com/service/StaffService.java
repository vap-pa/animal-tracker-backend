package com.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dto.CreateStaffDto;
import com.dto.StaffDto;
import com.dto.UpdateStaffDto;
import com.exception.ResourceNotFoundException;
import com.mapper.StaffMapper;
import com.model.Staff;
import com.repository.StaffRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;

    public List<StaffDto> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(staffMapper::toDto)
                .collect(Collectors.toList());
    }

    public StaffDto getStaffById(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        return staffMapper.toDto(staff);
    }

    public List<StaffDto> getStaffByRole(String role) {
        return staffRepository.findByRole(role).stream()
                .map(staffMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<StaffDto> getActiveStaff(boolean active) {
        return staffRepository.findByActive(active).stream()
                .map(staffMapper::toDto)
                .collect(Collectors.toList());
    }

    public StaffDto createStaff(CreateStaffDto createStaffDto) {
        Staff staff = staffMapper.toEntity(createStaffDto);
        Staff savedStaff = staffRepository.save(staff);
        return staffMapper.toDto(savedStaff);
    }

    public StaffDto updateStaff(Long id, UpdateStaffDto updateStaffDto) {
        Staff existingStaff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));

        staffMapper.updateEntity(updateStaffDto, existingStaff);
        Staff updatedStaff = staffRepository.save(existingStaff);
        return staffMapper.toDto(updatedStaff);
    }

    public void deactivateStaff(Long id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        staff.setActive(false);
        staffRepository.save(staff);
    }
}