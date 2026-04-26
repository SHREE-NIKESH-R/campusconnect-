package com.campusconnect.controller;

import com.campusconnect.dto.request.CreateResourceRequest;
import com.campusconnect.dto.response.ApiResponse;
import com.campusconnect.dto.response.ResourceResponse;
import com.campusconnect.entity.Resource;
import com.campusconnect.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/resources")
@RequiredArgsConstructor
@Tag(name = "Resources", description = "Campus resource management")
public class ResourceController {

    private final ResourceService resourceService;

    @GetMapping
    @Operation(summary = "Get all active resources")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getAllResources(
            @RequestParam(required = false) Resource.ResourceType type) {
        List<ResourceResponse> resources = type != null
                ? resourceService.getResourcesByType(type)
                : resourceService.getAllResources();
        return ResponseEntity.ok(ApiResponse.ok(resources));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available resources for a time slot")
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getAvailable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {
        return ResponseEntity.ok(ApiResponse.ok(resourceService.findAvailable(date, startTime, endTime)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get resource by ID")
    public ResponseEntity<ApiResponse<ResourceResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(resourceService.getById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new resource (Admin only)")
    public ResponseEntity<ApiResponse<ResourceResponse>> create(@Valid @RequestBody CreateResourceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Resource created", resourceService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update resource (Admin only)")
    public ResponseEntity<ApiResponse<ResourceResponse>> update(
            @PathVariable Long id, @Valid @RequestBody CreateResourceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Resource updated", resourceService.update(id, request)));
    }

    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle resource availability (Admin only)")
    public ResponseEntity<ApiResponse<Void>> toggleAvailability(@PathVariable Long id) {
        resourceService.toggleAvailability(id);
        return ResponseEntity.ok(ApiResponse.ok("Availability toggled", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Soft delete resource (Admin only)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        resourceService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted", null));
    }
}
