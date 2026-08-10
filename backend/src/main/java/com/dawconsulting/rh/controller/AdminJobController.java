package com.dawconsulting.rh.controller;

import com.dawconsulting.rh.dto.JobRequest;
import com.dawconsulting.rh.dto.JobResponse;
import com.dawconsulting.rh.dto.MessageResponse;
import com.dawconsulting.rh.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/jobs")
public class AdminJobController {

    private final JobService jobService;

    public AdminJobController(JobService jobService) { this.jobService = jobService; }

    @GetMapping
    public List<JobResponse> list() { return jobService.listAll(); }

    @GetMapping("/{id}")
    public JobResponse get(@PathVariable Long id) { return jobService.getAny(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobResponse create(@Valid @RequestBody JobRequest request) { return jobService.create(request); }

    @PutMapping("/{id}")
    public JobResponse update(@PathVariable Long id, @Valid @RequestBody JobRequest request) {
        return jobService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable Long id) {
        jobService.delete(id);
        return new MessageResponse(true, "Offre supprimee.");
    }
}
