package com.signcheck.p02.util;

import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class TokenGenerator {

    public String generate() {
        return UUID.randomUUID().toString();
    }
}
