package com.zidioconnect.repository;

import com.zidioconnect.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByRecruiterId(Long recruiterId);
}
