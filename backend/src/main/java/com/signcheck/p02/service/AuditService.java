package com.signcheck.p02.service;

import com.signcheck.p02.entity.AuditLog;
import com.signcheck.p02.repository.AuditLogRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog log(String actor, String action) {
        AuditLog log = new AuditLog();
        log.setActor(actor);
        log.setAction(action);
        return auditLogRepository.save(log);
    }

    public List<AuditLog> list() {
        return auditLogRepository.findAll();
    }
}
