package com.campusconnect.dto.response;
import com.campusconnect.entity.User;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String department;
    private String studentId;
    private String phone;
    private String avatarUrl;
    private User.Role role;
    private LocalDateTime createdAt;
}
