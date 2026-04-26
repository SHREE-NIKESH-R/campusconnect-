package com.campusconnect.dto.response;

import com.campusconnect.entity.Booking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data @Builder
public class BookingResponse {
    private Long id;
    private Long resourceId;
    private String resourceName;
    private String resourceLocation;
    private String resourceType;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userRole;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private String notes;
    private Booking.BookingStatus status;
    private String adminNotes;
    private String approvedBy;
    private Integer attendeesCount;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
}