package com.campusconnect.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateBookingRequest {
    @NotNull
    private Long resourceId;

    @NotNull
    private LocalDate bookingDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotBlank
    private String purpose;

    private String notes;

    @Min(1) @Max(500)
    private Integer attendeesCount = 1;
}
