package com.controller;


import com.dto.StaffDto;
import com.dto.CreateStaffDto;
import com.dto.UpdateStaffDto;
import com.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@Tag(name = "Staff", description = "Staff management APIs")
public class StaffController {
    private final StaffService staffService;

    @GetMapping
    @Operation(summary = "Get all staff members or filter by role/status")
    public ResponseEntity<List<StaffDto>> getAllStaff(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active) {
        if (role != null) {
            return ResponseEntity.ok(staffService.getStaffByRole(role));
        } else if (active != null) {
            return ResponseEntity.ok(staffService.getActiveStaff(active));
        } else {
            return ResponseEntity.ok(staffService.getAllStaff());
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get staff member by ID")
    public ResponseEntity<StaffDto> getStaffById(@PathVariable Long id) {
        StaffDto staff = staffService.getStaffById(id);
        return ResponseEntity.ok(staff);
    }

    @PostMapping
    @Operation(summary = "Create a new staff member")
    public ResponseEntity<StaffDto> createStaff(@Valid @RequestBody CreateStaffDto createStaffDto) {
        StaffDto createdStaff = staffService.createStaff(createStaffDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStaff);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing staff member")
    public ResponseEntity<StaffDto> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStaffDto updateStaffDto) {
        StaffDto updatedStaff = staffService.updateStaff(id, updateStaffDto);
        return ResponseEntity.ok(updatedStaff);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a staff member")
    public ResponseEntity<Void> deactivateStaff(@PathVariable Long id) {
        staffService.deactivateStaff(id);
        return ResponseEntity.noContent().build();
    }
}