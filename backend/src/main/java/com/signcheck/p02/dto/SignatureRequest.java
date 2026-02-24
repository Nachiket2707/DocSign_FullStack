package com.signcheck.p02.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignatureRequest(
    @NotNull Long documentId,
    @NotBlank @Email String signerEmail,
    String signerName,
    @NotNull Integer page,
    @NotNull Float x,
    @NotNull Float y,
    String status
) {
}
