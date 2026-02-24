package com.signcheck.p02.controller;

import com.signcheck.p02.dto.DocumentUploadRequest;
import com.signcheck.p02.entity.Document;
import com.signcheck.p02.service.DocumentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@Validated
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public Document upload(@Valid @RequestBody DocumentUploadRequest request) {
        return documentService.upload(request);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Document uploadFile(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "title", required = false) String title,
        @RequestParam("ownerEmail") @NotBlank @Email String ownerEmail
    ) {
        return documentService.uploadFile(file, title, ownerEmail);
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> getUploadedFile(@PathVariable String fileName) {
        Resource resource = documentService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline().filename(fileName).build().toString())
            .body(resource);
    }

    @GetMapping("/{id}")
    public Document getById(@PathVariable Long id) {
        return documentService.getById(id);
    }
}
