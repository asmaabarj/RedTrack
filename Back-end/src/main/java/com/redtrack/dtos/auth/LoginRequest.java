package com.redtrack.dtos.auth;

import lombok.Data;

@Data
public class LoginRequest {
    private String login;
    private String password;
}