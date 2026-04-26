package com.campusconnect.repository;

import com.campusconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(User.Role role);

    @Query("SELECT u FROM User u WHERE u.enabled = true ORDER BY u.createdAt DESC")
    List<User> findAllActiveUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(User.Role role);
}
