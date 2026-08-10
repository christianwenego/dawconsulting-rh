package com.dawconsulting.rh.dto;

import com.dawconsulting.rh.model.ApplicationStatus;
import com.dawconsulting.rh.model.JobApplication;
import java.time.Instant;

public record ApplicationResponse(
        Long id, Long jobId, String jobTitle, String fullName, String email,
        String phone, String coverLetter, String cvOriginalName,
        boolean hasCv, ApplicationStatus status, Instant createdAt
) {
    public static ApplicationResponse from(JobApplication a) {
        return new ApplicationResponse(
                a.getId(),
                a.getJob() != null ? a.getJob().getId() : null,
                a.getJob() != null ? a.getJob().getTitle() : null,
                a.getFullName(), a.getEmail(), a.getPhone(), a.getCoverLetter(),
                a.getCvOriginalName(), a.getCvStoredName() != null,
                a.getStatus(), a.getCreatedAt());
    }
}
