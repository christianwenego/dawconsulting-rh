package com.dawconsulting.rh.dto;

import com.dawconsulting.rh.model.ContractType;
import com.dawconsulting.rh.model.Job;
import com.dawconsulting.rh.model.JobStatus;
import java.time.Instant;

public record JobResponse(
        Long id, String title, String department, String location,
        ContractType contractType, String experienceLevel, String description,
        String responsibilities, String requirements,
        Integer salaryMin, Integer salaryMax, JobStatus status,
        Instant createdAt, Instant closingDate, long applicationCount
) {
    public static JobResponse from(Job j, long applicationCount) {
        return new JobResponse(
                j.getId(), j.getTitle(), j.getDepartment(), j.getLocation(),
                j.getContractType(), j.getExperienceLevel(), j.getDescription(),
                j.getResponsibilities(), j.getRequirements(),
                j.getSalaryMin(), j.getSalaryMax(), j.getStatus(),
                j.getCreatedAt(), j.getClosingDate(), applicationCount);
    }
    public static JobResponse from(Job j) { return from(j, 0L); }
}
