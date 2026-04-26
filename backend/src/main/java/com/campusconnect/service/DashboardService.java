package com.campusconnect.service;

import com.campusconnect.dto.response.DashboardStatsResponse;
import com.campusconnect.entity.Booking;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.User;
import com.campusconnect.repository.BookingRepository;
import com.campusconnect.repository.ResourceRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final BookingService bookingService;

    public DashboardStatsResponse getStats() {
        long totalResources = resourceRepository.count();
        long availableResources = resourceRepository.findByAvailableTrueAndActiveTrue().size();
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(Booking.BookingStatus.PENDING);
        long approvedBookings = bookingRepository.countByStatus(Booking.BookingStatus.APPROVED);
        long totalUsers = userRepository.count();
        long todayBookings = bookingRepository.findByDate(LocalDate.now()).size();

        return DashboardStatsResponse.builder()
                .totalResources(totalResources)
                .availableResources(availableResources)
                .totalBookings(totalBookings)
                .pendingBookings(pendingBookings)
                .approvedBookings(approvedBookings)
                .totalUsers(totalUsers)
                .todayBookings(todayBookings)
                .recentBookings(bookingService.getRecentBookings())
                .build();
    }
}
