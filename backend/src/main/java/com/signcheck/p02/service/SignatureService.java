package com.signcheck.p02.service;

import com.signcheck.p02.dto.SignatureRequest;
import com.signcheck.p02.entity.Document;
import com.signcheck.p02.entity.Signature;
import com.signcheck.p02.exception.ResourceNotFoundException;
import com.signcheck.p02.repository.DocumentRepository;
import com.signcheck.p02.repository.SignatureRepository;
import com.signcheck.p02.util.PdfUtil;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class SignatureService {

    private final SignatureRepository signatureRepository;
    private final DocumentRepository documentRepository;
    private final PdfUtil pdfUtil;

    public SignatureService(
        SignatureRepository signatureRepository,
        DocumentRepository documentRepository,
        PdfUtil pdfUtil
    ) {
        this.signatureRepository = signatureRepository;
        this.documentRepository = documentRepository;
        this.pdfUtil = pdfUtil;
    }

    public Signature sign(SignatureRequest request) {
        Document document = documentRepository.findById(request.documentId())
            .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + request.documentId()));

        String signedFileUrl = pdfUtil.applySignature(
            document.getFileUrl(),
            request.signerName(),
            request.page(),
            request.x(),
            request.y()
        );

        String finalStatus = (request.status() == null || request.status().isBlank()) ? "SIGNED" : request.status();

        document.setFileUrl(signedFileUrl);
        document.setStatus("SIGNED");
        documentRepository.save(document);

        Signature signature = new Signature();
        signature.setDocumentId(request.documentId());
        signature.setSignerEmail(request.signerEmail());
        signature.setSignerName(request.signerName());
        signature.setPage(request.page());
        signature.setX(request.x());
        signature.setY(request.y());
        signature.setStatus(finalStatus);
        signature.setSignedAt(Instant.now());

        return signatureRepository.save(signature);
    }
}
