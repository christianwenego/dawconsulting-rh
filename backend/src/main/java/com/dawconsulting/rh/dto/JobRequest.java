package com.dawconsulting.rh.dto;

import com.dawconsulting.rh.model.ContractType;
import com.dawconsulting.rh.model.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record JobRequest(
        @NotBlank String title,
        String department,
        @NotBlank String location,
        @NotNull ContractType contractType,
        String experienceLevel,
        @NotBlank String description,
        String responsibilities,
        String requirements,
        Integer salaryMin,
        Integer salaryMax,
        JobStatus status,
        Instant closingDate
) {}
