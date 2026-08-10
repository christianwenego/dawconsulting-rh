package com.dawconsulting.rh.controller;

import com.dawconsulting.rh.dto.MessageResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    @GetMapping
    public MessageResponse health() {
        return new MessageResponse(true, "DAW Consulting RH API operationnelle.");
    }
}
