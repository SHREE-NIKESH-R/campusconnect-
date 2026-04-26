package com.campusconnect.controller;

import com.campusconnect.dto.request.CreateBookingRequest;
import com.campusconnect.dto.request.UpdateBookingStatusRequest;
import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.dto.response.BookingResponse;
import com.campusconnect.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Bookings", description = "Booking management")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<ApiResponse<BookingResponse>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse response = bookingService.createBooking(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking created successfully", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getUserBookings(userDetails.getUsername())));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all bookings (Admin only)")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getAllBookings()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get pending bookings (Admin only)")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getPendingBookings() {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getPendingBookings()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update booking status (Admin only)")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", bookingService.updateStatus(id, request)));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled", bookingService.cancelBooking(id, userDetails.getUsername())));
    }
}
