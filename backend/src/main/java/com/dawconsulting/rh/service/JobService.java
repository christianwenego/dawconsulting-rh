package com.dawconsulting.rh.service;

import com.dawconsulting.rh.dto.JobRequest;
import com.dawconsulting.rh.dto.JobResponse;
import com.dawconsulting.rh.exception.NotFoundException;
import com.dawconsulting.rh.model.Job;
import com.dawconsulting.rh.model.JobStatus;
import com.dawconsulting.rh.repository.JobApplicationRepository;
import com.dawconsulting.rh.repository.JobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepo;
    private final JobApplicationRepository appRepo;

    public JobService(JobRepository jobRepo, JobApplicationRepository appRepo) {
        this.jobRepo = jobRepo;
        this.appRepo = appRepo;
    }

    // ---------- Public ----------
    @Transactional(readOnly = true)
    public List<JobResponse> listPublished(String q, String department, String location, int page, int size) {
        Page<Job> result = jobRepo.searchPublished(
                JobStatus.PUBLISHED,
                emptyToEmpty(q),
                emptyToEmpty(department),
                emptyToEmpty(location),
                PageRequest.of(
                        Math.max(page, 0),
                        Math.min(Math.max(size, 1), 50)
                )
        );
        return result.getContent().stream().map(JobResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public JobResponse getPublished(Long id) {
        Job job = jobRepo.findByIdAndStatus(id, JobStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Offre introuvable ou non disponible."));
        return JobResponse.from(job);
    }

    // ---------- Admin ----------
    @Transactional(readOnly = true)
    public List<JobResponse> listAll() {
        return jobRepo.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(j -> JobResponse.from(j, appRepo.countByJobId(j.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public JobResponse getAny(Long id) {
        Job job = jobRepo.findById(id).orElseThrow(() -> new NotFoundException("Offre introuvable."));
        return JobResponse.from(job, appRepo.countByJobId(id));
    }

    @Transactional
    public JobResponse create(JobRequest req) {
        Job job = new Job();
        apply(job, req);
        return JobResponse.from(jobRepo.save(job));
    }

    @Transactional
    public JobResponse update(Long id, JobRequest req) {
        Job job = jobRepo.findById(id).orElseThrow(() -> new NotFoundException("Offre introuvable."));
        apply(job, req);
        return JobResponse.from(jobRepo.save(job), appRepo.countByJobId(id));
    }

    @Transactional
    public void delete(Long id) {
        if (!jobRepo.existsById(id)) throw new NotFoundException("Offre introuvable.");
        jobRepo.deleteById(id);
    }

    private void apply(Job job, JobRequest req) {
        job.setTitle(req.title());
        job.setDepartment(req.department());
        job.setLocation(req.location());
        job.setContractType(req.contractType());
        job.setExperienceLevel(req.experienceLevel());
        job.setDescription(req.description());
        job.setResponsibilities(req.responsibilities());
        job.setRequirements(req.requirements());
        job.setSalaryMin(req.salaryMin());
        job.setSalaryMax(req.salaryMax());
        job.setStatus(req.status() != null ? req.status() : JobStatus.PUBLISHED);
        job.setClosingDate(req.closingDate());
    }

    private String emptyToEmpty(String s) {
        return (s == null || s.isBlank()) ? "" : s.trim();
    }
}
