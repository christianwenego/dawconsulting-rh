package com.dawconsulting.rh.controller;

import com.dawconsulting.rh.dto.ContactRequest;
import com.dawconsulting.rh.dto.MessageResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    @PostMapping
    public MessageResponse submit(@Valid @RequestBody ContactRequest request) {
        // Point d'extension : brancher ici l'envoi d'e-mail (JavaMailSender) ou une persistance.
        log.info("Nouveau message de contact de {} <{}> (societe: {})",
                request.name(), request.email(), request.company());
        return new MessageResponse(true, "Merci, votre message a bien ete recu. Notre equipe vous recontacte sous 48h.");
    }
}
