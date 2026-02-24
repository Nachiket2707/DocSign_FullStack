package com.signcheck.p02.service;

import com.signcheck.p02.dto.DocumentUploadRequest;
import com.signcheck.p02.entity.Document;
import com.signcheck.p02.exception.ResourceNotFoundException;
import com.signcheck.p02.repository.DocumentRepository;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final Path uploadDir;

    public DocumentService(
        DocumentRepository documentRepository,
        @Value("${app.upload.dir:uploads}") String uploadDir
    ) throws IOException {
        this.documentRepository = documentRepository;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    public Document upload(DocumentUploadRequest request) {
        return createDocument(request.title(), request.fileUrl(), request.ownerEmail());
    }

    public Document uploadFile(MultipartFile file, String title, String ownerEmail) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "document.pdf" : file.getOriginalFilename());
        if (!originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        String storedFileName = UUID.randomUUID() + "-" + originalFileName;
        Path targetPath = uploadDir.resolve(storedFileName).normalize();

        if (!targetPath.startsWith(uploadDir)) {
            throw new IllegalArgumentException("Invalid file name");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new IllegalArgumentException("Failed to store uploaded file");
        }

        String resolvedTitle = StringUtils.hasText(title) ? title : originalFileName;
        String fileUrl = "/api/documents/files/" + storedFileName;
        return createDocument(resolvedTitle, fileUrl, ownerEmail);
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path resolved = uploadDir.resolve(fileName).normalize();
            if (!resolved.startsWith(uploadDir)) {
                throw new IllegalArgumentException("Invalid file path");
            }
            if (!Files.exists(resolved)) {
                throw new ResourceNotFoundException("File not found: " + fileName);
            }
            return new UrlResource(resolved.toUri());
        } catch (IOException ex) {
            throw new IllegalArgumentException("Could not load file");
        }
    }

    public Document getById(Long id) {
        return documentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));
    }

    private Document createDocument(String title, String fileUrl, String ownerEmail) {
        Document document = new Document();
        document.setTitle(title);
        document.setFileUrl(fileUrl);
        document.setOwnerEmail(ownerEmail);
        document.setStatus("DRAFT");
        return documentRepository.save(document);
    }
}
