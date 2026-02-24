package com.signcheck.p02.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PdfUtil {

    private static final String FILE_URL_PREFIX = "/api/documents/files/";
    private final Path uploadDir;

    public PdfUtil(@Value("${app.upload.dir:uploads}") String uploadDir) throws IOException {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDir);
    }

    public String applySignature(String sourceFileUrl, String signerName, Integer page, Float x, Float y) {
        Path sourcePath = resolveSourcePath(sourceFileUrl);
        if (!Files.exists(sourcePath)) {
            throw new IllegalArgumentException("Source PDF not found");
        }

        String displayName = (signerName == null || signerName.isBlank()) ? "Signed" : signerName;

        try (PDDocument document = Loader.loadPDF(sourcePath.toFile())) {
            if (page == null || page < 1 || page > document.getNumberOfPages()) {
                throw new IllegalArgumentException("Invalid page number");
            }

            PDPage targetPage = document.getPage(page - 1);
            float pageWidth = targetPage.getMediaBox().getWidth();
            float pageHeight = targetPage.getMediaBox().getHeight();

            float rawX = x == null ? 50f : x;
            float rawY = y == null ? 50f : y;

            float clampedX = Math.max(10f, Math.min(rawX, pageWidth - 120f));
            float pdfY = pageHeight - rawY;
            float clampedY = Math.max(20f, Math.min(pdfY, pageHeight - 20f));

            try (PDPageContentStream contentStream = new PDPageContentStream(
                document,
                targetPage,
                PDPageContentStream.AppendMode.APPEND,
                true,
                true
            )) {
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE), 20);
                contentStream.beginText();
                contentStream.newLineAtOffset(clampedX, clampedY);
                contentStream.showText(displayName);
                contentStream.endText();
            }

            String outputFileName = UUID.randomUUID() + "-signed.pdf";
            Path outputPath = uploadDir.resolve(outputFileName).normalize();
            if (!outputPath.startsWith(uploadDir)) {
                throw new IllegalArgumentException("Invalid output file path");
            }
            document.save(outputPath.toFile());

            return FILE_URL_PREFIX + outputFileName;
        } catch (IOException ex) {
            throw new IllegalArgumentException("Failed to apply signature on PDF");
        }
    }

    private Path resolveSourcePath(String sourceFileUrl) {
        if (sourceFileUrl == null || sourceFileUrl.isBlank() || !sourceFileUrl.startsWith(FILE_URL_PREFIX)) {
            throw new IllegalArgumentException("Only locally uploaded PDFs can be signed");
        }

        String fileName = sourceFileUrl.substring(FILE_URL_PREFIX.length());
        Path resolved = uploadDir.resolve(fileName).normalize();
        if (!resolved.startsWith(uploadDir)) {
            throw new IllegalArgumentException("Invalid source file path");
        }
        return resolved;
    }
}
