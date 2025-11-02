package com.zidioconnect.service;

import com.zidioconnect.model.User;
import com.zidioconnect.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User create(User user) {
        return userRepository.save(user);
    }

    public Collection<User> list() {
        return userRepository.findAll();
    }
}
