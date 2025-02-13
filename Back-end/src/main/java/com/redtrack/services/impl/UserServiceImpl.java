package com.redtrack.services.impl;

import com.redtrack.dtos.UserDTO;
import com.redtrack.mappers.UserMapper;
import com.redtrack.repositories.UserRepository;
import com.redtrack.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public Page<UserDTO> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::userToUserDTO);
    }

 
}