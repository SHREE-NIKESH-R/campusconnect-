package com.campusconnect.repository;

import com.campusconnect.entity.Booking;
import com.campusconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserOrderByCreatedAtDesc(User user);

    List<Booking> findAllByOrderByBookingDateAscStartTimeAsc();

    List<Booking> findByStatusOrderByBookingDateAscStartTimeAsc(Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.resource.id = :resourceId " +
            "AND b.bookingDate = :date AND b.status IN ('PENDING', 'APPROVED') " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("SELECT b FROM Booking b WHERE b.bookingDate = :date ORDER BY b.startTime")
    List<Booking> findByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(@Param("status") Booking.BookingStatus status);

    @Query("SELECT b FROM Booking b ORDER BY b.createdAt DESC LIMIT 10")
    List<Booking> findRecentBookings();
}