package com.campusconnect.service;

import com.campusconnect.dto.request.CreateBookingRequest;
import com.campusconnect.dto.request.UpdateBookingStatusRequest;
import com.campusconnect.dto.response.BookingResponse;
import com.campusconnect.entity.Booking;
import com.campusconnect.entity.Resource;
import com.campusconnect.entity.User;
import com.campusconnect.exception.BadRequestException;
import com.campusconnect.exception.ConflictException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.BookingRepository;
import com.campusconnect.repository.ResourceRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    // Valid status transitions
    private static final Set<Booking.BookingStatus> CANCELLABLE =
            Set.of(Booking.BookingStatus.PENDING, Booking.BookingStatus.APPROVED);

    @Transactional
    public BookingResponse createBooking(String userEmail, CreateBookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + request.getResourceId()));

        if (!resource.isAvailable())
            throw new BadRequestException("Resource is currently unavailable for booking");

        if (!resource.isActive())
            throw new BadRequestException("Resource does not exist");

        if (request.getStartTime() == null || request.getEndTime() == null)
            throw new BadRequestException("Start time and end time are required");

        if (!request.getStartTime().isBefore(request.getEndTime()))
            throw new BadRequestException("Start time must be before end time");

        if (request.getBookingDate().isBefore(LocalDate.now()))
            throw new BadRequestException("Cannot book for a past date");

        // Attendees vs capacity check
        if (request.getAttendeesCount() != null &&
                request.getAttendeesCount() > resource.getCapacity()) {
            throw new BadRequestException(
                    "Attendees count (" + request.getAttendeesCount() +
                            ") exceeds resource capacity (" + resource.getCapacity() + ")"
            );
        }

        // Conflict check
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resource.getId(), request.getBookingDate(),
                request.getStartTime(), request.getEndTime());

        if (!conflicts.isEmpty())
            throw new ConflictException("Resource is already booked for the selected time slot");

        Booking booking = Booking.builder()
                .user(user)
                .resource(resource)
                .bookingDate(request.getBookingDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .notes(request.getNotes())
                .attendeesCount(request.getAttendeesCount() != null ? request.getAttendeesCount() : 1)
                .status(Booking.BookingStatus.PENDING)
                .build();

        return mapToResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::mapToResponse).toList();
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository
                .findAllByOrderByBookingDateAscStartTimeAsc()
                .stream().map(this::mapToResponse).toList();
    }

    public List<BookingResponse> getPendingBookings() {
        return bookingRepository
                .findByStatusOrderByBookingDateAscStartTimeAsc(Booking.BookingStatus.PENDING)
                .stream().map(this::mapToResponse).toList();
    }

    public List<BookingResponse> getRecentBookings() {
        return bookingRepository.findRecentBookings()
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public BookingResponse updateStatus(Long bookingId, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Validate transition — can't un-cancel or re-approve
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED)
            throw new BadRequestException("Cannot update a cancelled booking");
        if (booking.getStatus() == Booking.BookingStatus.REJECTED &&
                request.getStatus() == Booking.BookingStatus.APPROVED)
            throw new BadRequestException("Cannot approve a rejected booking. Ask user to re-book.");

        String adminEmail = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        booking.setStatus(request.getStatus());
        booking.setAdminNotes(request.getAdminNotes());

        if (request.getStatus() == Booking.BookingStatus.APPROVED) {
            booking.setApprovedAt(LocalDateTime.now());
            booking.setApprovedBy(adminEmail);
        } else if (request.getStatus() == Booking.BookingStatus.CANCELLED) {
            booking.setCancelledAt(LocalDateTime.now());
        }

        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (!booking.getUser().getEmail().equals(userEmail))
            throw new BadRequestException("You can only cancel your own bookings");

        if (!CANCELLABLE.contains(booking.getStatus()))
            throw new BadRequestException("This booking cannot be cancelled");

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse mapToResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .resourceId(b.getResource().getId())
                .resourceName(b.getResource().getName())
                .resourceLocation(b.getResource().getLocation())
                .resourceType(b.getResource().getType().name())
                .userId(b.getUser().getId())
                .userName(b.getUser().getFullName())
                .userEmail(b.getUser().getEmail())
                .userRole(b.getUser().getRole().name())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .notes(b.getNotes())
                .status(b.getStatus())
                .adminNotes(b.getAdminNotes())
                .approvedBy(b.getApprovedBy())
                .attendeesCount(b.getAttendeesCount())
                .createdAt(b.getCreatedAt())
                .approvedAt(b.getApprovedAt())
                .build();
    }
}