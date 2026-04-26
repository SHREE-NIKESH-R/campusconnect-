package com.campusconnect.service;

import com.campusconnect.dto.request.CreateResourceRequest;
import com.campusconnect.dto.response.ResourceResponse;
import com.campusconnect.entity.Resource;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findByActiveTrue()
                .stream().map(this::mapToResponse).toList();
    }

    public List<ResourceResponse> getAvailableResources() {
        return resourceRepository.findByAvailableTrueAndActiveTrue()
                .stream().map(this::mapToResponse).toList();
    }

    public List<ResourceResponse> getResourcesByType(Resource.ResourceType type) {
        return resourceRepository.findByTypeAndActiveTrue(type)
                .stream().map(this::mapToResponse).toList();
    }

    public List<ResourceResponse> findAvailable(LocalDate date, LocalTime start, LocalTime end) {
        return resourceRepository.findAvailableResources(date, start, end)
                .stream().map(this::mapToResponse).toList();
    }

    public ResourceResponse getById(Long id) {
        return resourceRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
    }

    @Transactional
    public ResourceResponse create(CreateResourceRequest request) {
        Resource resource = Resource.builder()
                .name(request.getName())
                .description(request.getDescription())
                .type(request.getType())
                .location(request.getLocation())
                .building(request.getBuilding())
                .floor(request.getFloor())
                .roomNumber(request.getRoomNumber())
                .capacity(request.getCapacity())
                .imageUrl(request.getImageUrl())
                .amenities(request.getAmenities() != null ? request.getAmenities() : List.of())
                .build();
        return mapToResponse(resourceRepository.save(resource));
    }

    @Transactional
    public ResourceResponse update(Long id, CreateResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
        resource.setName(request.getName());
        resource.setDescription(request.getDescription());
        resource.setType(request.getType());
        resource.setLocation(request.getLocation());
        resource.setBuilding(request.getBuilding());
        resource.setFloor(request.getFloor());
        resource.setRoomNumber(request.getRoomNumber());
        resource.setCapacity(request.getCapacity());
        resource.setImageUrl(request.getImageUrl());
        if (request.getAmenities() != null) resource.setAmenities(request.getAmenities());
        return mapToResponse(resourceRepository.save(resource));
    }

    @Transactional
    public void toggleAvailability(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
        resource.setAvailable(!resource.isAvailable());
        resourceRepository.save(resource);
    }

    @Transactional
    public void delete(Long id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
        resource.setActive(false);
        resourceRepository.save(resource);
    }

    public ResourceResponse mapToResponse(Resource r) {
        return ResourceResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .type(r.getType())
                .location(r.getLocation())
                .building(r.getBuilding())
                .floor(r.getFloor())
                .roomNumber(r.getRoomNumber())
                .capacity(r.getCapacity())
                .imageUrl(r.getImageUrl())
                .available(r.isAvailable())
                .active(r.isActive())
                .amenities(r.getAmenities())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
