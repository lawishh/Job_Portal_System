package com.zidioconnect.service;

import com.zidioconnect.model.Job;
import com.zidioconnect.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class JobService {
    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job create(Job job) {
        return jobRepository.save(job);
    }

    public Collection<Job> list() {
        return jobRepository.findAll();
    }
}
