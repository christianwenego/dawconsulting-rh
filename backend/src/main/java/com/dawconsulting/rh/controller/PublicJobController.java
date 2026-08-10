package com.dawconsulting.rh.controller;

import com.dawconsulting.rh.dto.ApplicationResponse;
import com.dawconsulting.rh.dto.JobResponse;
import com.dawconsulting.rh.service.ApplicationService;
import com.dawconsulting.rh.service.JobService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class PublicJobController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    public PublicJobController(JobService jobService, ApplicationService applicationService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<JobResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return jobService.listPublished(q, department, location, page, size);
    }

    @GetMapping("/{id}")
    public JobResponse get(@PathVariable Long id) {
        return jobService.getPublished(id);
    }

    @PostMapping(value = "/{id}/apply", consumes = "multipart/form-data")
    public ApplicationResponse apply(
            @PathVariable Long id,
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String coverLetter,
            @RequestParam(required = false) MultipartFile cv) {
        return applicationService.apply(id, fullName, email, phone, coverLetter, cv);
    }
}
