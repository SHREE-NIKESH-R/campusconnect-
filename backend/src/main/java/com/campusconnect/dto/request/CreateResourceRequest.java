package com.campusconnect.dto.request;

import com.campusconnect.entity.Resource;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateResourceRequest {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private Resource.ResourceType type;
    @NotBlank
    private String location;
    private String building;
    private String floor;
    private String roomNumber;
    @NotNull @Min(1)
    private Integer capacity;
    private String imageUrl;
    private List<String> amenities;
}
