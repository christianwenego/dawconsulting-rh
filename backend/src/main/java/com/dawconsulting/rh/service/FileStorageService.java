package com.dawconsulting.rh.service;

import com.dawconsulting.rh.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final List<String> ALLOWED = List.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private final Path root;

    public FileStorageService(@Value("${app.storage.upload-dir}") String dir) {
        this.root = Paths.get(dir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try { Files.createDirectories(root); }
        catch (IOException e) { throw new IllegalStateException("Impossible de creer le dossier d'upload", e); }
    }

    /** Sauvegarde le CV, retourne le nom de fichier stocke (UUID). */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Le fichier CV est vide.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED.contains(contentType)) {
            throw new BadRequestException("Format de CV non accepte. Utilisez PDF ou Word (.doc/.docx).");
        }
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "cv" : file.getOriginalFilename());
        String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
        String stored = UUID.randomUUID() + ext;
        try {
            Path target = root.resolve(stored).normalize();
            if (!target.getParent().equals(root)) throw new BadRequestException("Chemin de fichier invalide.");
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return stored;
        } catch (IOException e) {
            throw new IllegalStateException("Echec de l'enregistrement du CV.", e);
        }
    }

    public Resource load(String storedName) {
        try {
            Path file = root.resolve(storedName).normalize();
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) return resource;
            throw new BadRequestException("Fichier introuvable : " + storedName);
        } catch (MalformedURLException e) {
            throw new BadRequestException("Fichier introuvable : " + storedName);
        }
    }
}
