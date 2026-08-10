package com.dawconsulting.rh.service;

import com.dawconsulting.rh.dto.ApplicationResponse;
import com.dawconsulting.rh.dto.StatusUpdateRequest;
import com.dawconsulting.rh.exception.BadRequestException;
import com.dawconsulting.rh.exception.NotFoundException;
import com.dawconsulting.rh.model.Job;
import com.dawconsulting.rh.model.JobApplication;
import com.dawconsulting.rh.model.JobStatus;
import com.dawconsulting.rh.repository.JobApplicationRepository;
import com.dawconsulting.rh.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ApplicationService {

    private final JobApplicationRepository appRepo;
    private final JobRepository jobRepo;
    private final FileStorageService fileStorage;

    public ApplicationService(JobApplicationRepository appRepo, JobRepository jobRepo, FileStorageService fileStorage) {
        this.appRepo = appRepo;
        this.jobRepo = jobRepo;
        this.fileStorage = fileStorage;
    }

    @Transactional
    public ApplicationResponse apply(Long jobId, String fullName, String email, String phone,
                                     String coverLetter, MultipartFile cv) {
        Job job = jobRepo.findByIdAndStatus(jobId, JobStatus.PUBLISHED)
                .orElseThrow(() -> new NotFoundException("Cette offre n'accepte plus de candidatures."));

        if (fullName == null || fullName.isBlank()) throw new BadRequestException("Le nom complet est requis.");
        if (email == null || email.isBlank()) throw new BadRequestException("L'adresse e-mail est requise.");
        if (appRepo.existsByJobIdAndEmailIgnoreCase(jobId, email)) {
            throw new BadRequestException("Une candidature a deja ete soumise pour cette offre avec cet e-mail.");
        }

        JobApplication app = new JobApplication();
        app.setJob(job);
        app.setFullName(fullName.trim());
        app.setEmail(email.trim());
        app.setPhone(phone);
        app.setCoverLetter(coverLetter);

        if (cv != null && !cv.isEmpty()) {
            app.setCvStoredName(fileStorage.store(cv));
            app.setCvOriginalName(cv.getOriginalFilename());
            app.setCvContentType(cv.getContentType());
        }
        return ApplicationResponse.from(appRepo.save(app));
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listAll() {
        return appRepo.findAllByOrderByCreatedAtDesc().stream().map(ApplicationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listByJob(Long jobId) {
        return appRepo.findByJobIdOrderByCreatedAtDesc(jobId).stream().map(ApplicationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public JobApplication getEntity(Long id) {
        return appRepo.findById(id).orElseThrow(() -> new NotFoundException("Candidature introuvable."));
    }

    @Transactional
    public ApplicationResponse updateStatus(Long id, StatusUpdateRequest req) {
        JobApplication app = getEntity(id);
        app.setStatus(req.status());
        return ApplicationResponse.from(appRepo.save(app));
    }

    @Transactional
    public void delete(Long id) {
        if (!appRepo.existsById(id)) throw new NotFoundException("Candidature introuvable.");
        appRepo.deleteById(id);
    }
}
