package com.dawconsulting.rh.repository;

import com.dawconsulting.rh.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobIdOrderByCreatedAtDesc(Long jobId);
    List<JobApplication> findAllByOrderByCreatedAtDesc();
    long countByJobId(Long jobId);
    boolean existsByJobIdAndEmailIgnoreCase(Long jobId, String email);
}
