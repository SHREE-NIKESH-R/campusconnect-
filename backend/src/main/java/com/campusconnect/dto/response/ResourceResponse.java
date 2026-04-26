package com.campusconnect.dto.response;
import com.campusconnect.entity.Resource;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class ResourceResponse {
    private Long id;
    private String name;
    private String description;
    private Resource.ResourceType type;
    private String location;
    private String building;
    private String floor;
    private String roomNumber;
    private Integer capacity;
    private String imageUrl;
    private boolean available;
    private boolean active;
    private List<String> amenities;
    private LocalDateTime createdAt;
}
