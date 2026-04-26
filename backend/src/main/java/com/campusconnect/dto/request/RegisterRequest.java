package com.campusconnect.dto.request;

import com.campusconnect.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    @NotBlank
    private String fullName;

    private String department;
    private String studentId;
    private String phone;
    private User.Role role = User.Role.STUDENT;
}
