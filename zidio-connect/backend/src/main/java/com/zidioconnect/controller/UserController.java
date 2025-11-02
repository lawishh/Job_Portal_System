package com.zidioconnect.controller;

import com.zidioconnect.model.User;
import com.zidioconnect.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5501")
public class UserController {

    private final UserRepository userRepo;

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        if (userRepo.findByEmail(user.getEmail()) != null) {
            response.put("message", "Email already registered");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        // default role fallback if not provided
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("student");
        }
        userRepo.save(user);
        response.put("message", "Registration successful");
        response.put("name", user.getName());
        response.put("role", user.getRole());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        User existing = userRepo.findByEmail(user.getEmail());

        if (existing == null) {
            response.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        if (!existing.getPassword().equals(user.getPassword())) {
            response.put("message", "Invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("message", "Login successful");
        response.put("name", existing.getName());
        response.put("role", existing.getRole() != null ? existing.getRole() : "student");
        return ResponseEntity.ok(response);
    }
}
