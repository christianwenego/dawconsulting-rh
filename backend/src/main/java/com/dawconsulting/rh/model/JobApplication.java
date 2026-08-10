package com.dawconsulting.rh.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "applications")
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, length = 180)
    private String email;

    @Column(length = 40)
    private String phone;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    /** Nom de fichier stocke sur le disque (UUID). */
    @Column(length = 255)
    private String cvStoredName;

    /** Nom d'origine du CV (affiche a l'admin). */
    @Column(length = 255)
    private String cvOriginalName;

    @Column(length = 100)
    private String cvContentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private ApplicationStatus status = ApplicationStatus.RECEIVED;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getCvStoredName() { return cvStoredName; }
    public void setCvStoredName(String cvStoredName) { this.cvStoredName = cvStoredName; }
    public String getCvOriginalName() { return cvOriginalName; }
    public void setCvOriginalName(String cvOriginalName) { this.cvOriginalName = cvOriginalName; }
    public String getCvContentType() { return cvContentType; }
    public void setCvContentType(String cvContentType) { this.cvContentType = cvContentType; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
