package com.campusconnect.dto.request;

import com.campusconnect.entity.Booking;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBookingStatusRequest {
    @NotNull
    private Booking.BookingStatus status;
    private String adminNotes;
}
