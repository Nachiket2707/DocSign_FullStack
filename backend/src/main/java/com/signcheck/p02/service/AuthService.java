package com.signcheck.p02.service;

import com.signcheck.p02.dto.LoginRequest;
import com.signcheck.p02.dto.RegisterRequest;
import com.signcheck.p02.entity.User;
import com.signcheck.p02.repository.UserRepository;
import com.signcheck.p02.util.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public String register(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.email());
        user.setPassword(request.password());
        user.setRole("USER");
        userRepository.save(user);
        return jwtUtil.generateToken(request.email(), user.getRole());
    }

    public String login(LoginRequest request) {
        return jwtUtil.generateToken(request.email(), "USER");
    }
}
