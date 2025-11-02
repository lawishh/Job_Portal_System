package com.zidioconnect.controller;

import com.zidioconnect.model.Internship;
import com.zidioconnect.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5501")  // frontend port
@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    // ✅ Add new internship
    @PostMapping
    public Internship addInternship(@RequestBody Internship internship) {
        return internshipRepository.save(internship);
    }

    // ✅ Get all internships
    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    // ✅ Get internship by ID
    @GetMapping("/{id}")
    public Internship getInternshipById(@PathVariable Long id) {
        return internshipRepository.findById(id).orElse(null);
    }

    // ✅ Delete internship by ID
    @DeleteMapping("/{id}")
    public String deleteInternship(@PathVariable Long id) {
        if (internshipRepository.existsById(id)) {
            internshipRepository.deleteById(id);
            return "Internship deleted successfully!";
        } else {
            return "Internship not found!";
        }
    }
}
