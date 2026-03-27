package com.financapro.controller.economia;

import com.financapro.dto.economia.EconomiaRequestDto;
import com.financapro.dto.economia.EconomiaResponseDto;
import com.financapro.service.economia.EconomiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@RequiredArgsConstructor
public class EconomiasController {

    private final EconomiaService economiaService;

    @GetMapping
    public List<EconomiaResponseDto> list(@AuthenticationPrincipal UserDetails user) {
        return economiaService.getAll(user.getUsername());
    }

    @PostMapping
    public EconomiaResponseDto create(
        @AuthenticationPrincipal UserDetails user,
        @Valid @RequestBody EconomiaRequestDto req
    ) {
        return economiaService.create(user.getUsername(), req);
    }

    @PutMapping("/{id}")
    public EconomiaResponseDto update(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id,
        @Valid @RequestBody EconomiaRequestDto req
    ) {
        return economiaService.update(user.getUsername(), id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id
    ) {
        economiaService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}






