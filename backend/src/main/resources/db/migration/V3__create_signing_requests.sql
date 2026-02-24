CREATE TABLE IF NOT EXISTS signatures (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL,
    signer_email VARCHAR(255) NOT NULL,
    signer_name VARCHAR(255),
    page INT NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    status VARCHAR(50) NOT NULL,
    signed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_signatures_document FOREIGN KEY (document_id) REFERENCES documents(id)
);
