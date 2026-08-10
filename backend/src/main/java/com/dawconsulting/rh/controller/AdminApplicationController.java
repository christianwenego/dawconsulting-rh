package com.dawconsulting.rh.controller;

import com.dawconsulting.rh.dto.ApplicationResponse;
import com.dawconsulting.rh.dto.MessageResponse;
import com.dawconsulting.rh.dto.StatusUpdateRequest;
import com.dawconsulting.rh.model.JobApplication;
import com.dawconsulting.rh.service.ApplicationService;
import com.dawconsulting.rh.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/applications")
public class AdminApplicationController {

    private final ApplicationService applicationService;
    private final FileStorageService fileStorage;

    public AdminApplicationController(ApplicationService applicationService, FileStorageService fileStorage) {
        this.applicationService = applicationService;
        this.fileStorage = fileStorage;
    }

    @GetMapping
    public List<ApplicationResponse> list(@RequestParam(required = false) Long jobId) {
        return jobId != null ? applicationService.listByJob(jobId) : applicationService.listAll();
    }

    @PatchMapping("/{id}/status")
    public ApplicationResponse updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return applicationService.updateStatus(id, request);
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<Resource> downloadCv(@PathVariable Long id) {
        JobApplication app = applicationService.getEntity(id);
        if (app.getCvStoredName() == null) return ResponseEntity.notFound().build();
        Resource resource = fileStorage.load(app.getCvStoredName());
        String filename = app.getCvOriginalName() != null ? app.getCvOriginalName() : "cv";
        String ct = app.getCvContentType() != null ? app.getCvContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(ct))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable Long id) {
        applicationService.delete(id);
        return new MessageResponse(true, "Candidature supprimee.");
    }
}
