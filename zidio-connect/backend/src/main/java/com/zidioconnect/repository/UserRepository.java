package com.zidioconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zidioconnect.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
