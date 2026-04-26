package com.campusconnect.dto.response;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class DashboardStatsResponse {
    private long totalResources;
    private long availableResources;
    private long totalBookings;
    private long pendingBookings;
    private long approvedBookings;
    private long totalUsers;
    private long todayBookings;
    private List<BookingResponse> recentBookings;
}
