package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enclosures")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enclosure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // Indoor, Outdoor, etc.

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private int currentOccupancy;

    @Column(nullable = false)
    private String status; // Active, Maintenance, etc.

    @Column(length = 1000)
    private String description;
} 