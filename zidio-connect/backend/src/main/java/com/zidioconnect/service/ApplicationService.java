package com.zidioconnect.service;

import com.zidioconnect.model.Application;
import com.zidioconnect.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application create(Application application) {
        return applicationRepository.save(application);
    }

    public Collection<Application> list() {
        return applicationRepository.findAll();
    }
}
