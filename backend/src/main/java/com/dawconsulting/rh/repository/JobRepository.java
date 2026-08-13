package com.dawconsulting.rh.repository;

import com.dawconsulting.rh.model.Job;
import com.dawconsulting.rh.model.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    Optional<Job> findByIdAndStatus(Long id, JobStatus status);

    @Query("""
        SELECT j FROM Job j
        WHERE j.status = com.dawconsulting.rh.model.JobStatus.PUBLISHED
          AND (:q IS NULL OR LOWER(j.title) LIKE LOWER(CAST(CONCAT('%', :q, '%') AS String))
                            OR LOWER(j.description) LIKE LOWER(CAST(CONCAT('%', :q, '%') AS String)))
          AND (:department IS NULL OR j.department = :department)
          AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CAST(CONCAT('%', :location, '%') AS String)))
        ORDER BY j.createdAt DESC
        """)
    Page<Job> searchPublished(@Param("q") String q,
                              @Param("department") String department,
                              @Param("location") String location,
                              Pageable pageable);
}
