package com.dawconsulting.rh.dto;

import com.dawconsulting.rh.model.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull ApplicationStatus status) {}
