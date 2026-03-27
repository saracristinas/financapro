package com.financapro.controller.equipe;

import com.financapro.dto.equipe.ConviteRequestDto;
import com.financapro.dto.equipe.MembroEquipeResponseDto;
import com.financapro.service.equipe.EquipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/team")
@RequiredArgsConstructor
public class EquipeController {

    private final EquipeService equipeService;

    @GetMapping
    public List<MembroEquipeResponseDto> list(@AuthenticationPrincipal UserDetails user) {
        return equipeService.getTeam(user.getUsername());
    }

    @PostMapping("/invite")
    public MembroEquipeResponseDto invite(
        @AuthenticationPrincipal UserDetails user,
        @Valid @RequestBody ConviteRequestDto req
    ) {
        return equipeService.invite(user.getUsername(), req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id
    ) {
        equipeService.remove(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}






