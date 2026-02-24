package com.signcheck.p02.controller;

import com.signcheck.p02.dto.SignatureRequest;
import com.signcheck.p02.entity.Signature;
import com.signcheck.p02.service.SignatureService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/signatures")
public class SignatureController {

    private final SignatureService signatureService;

    public SignatureController(SignatureService signatureService) {
        this.signatureService = signatureService;
    }

    @PostMapping
    public Signature sign(@Valid @RequestBody SignatureRequest request) {
        return signatureService.sign(request);
    }
}
