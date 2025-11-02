package com.zidioconnect.controller;

import com.zidioconnect.model.Application;
import com.zidioconnect.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5501")
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    // Create new application (student applies)
    @PostMapping
    public Application apply(@RequestBody Application application) {
        return applicationRepository.save(application);
    }

    // Get all applications for a recruiter
    @GetMapping("/recruiter/{recruiterId}")
    public List<Application> getApplicationsByRecruiter(@PathVariable Long recruiterId) {
        return applicationRepository.findByRecruiterId(recruiterId);
    }
}
