package com.signcheck.p02.dto;

import jakarta.validation.constraints.NotBlank;

public record DocumentUploadRequest(
    @NotBlank String title,
    @NotBlank String fileUrl,
    @NotBlank String ownerEmail
) {
}
