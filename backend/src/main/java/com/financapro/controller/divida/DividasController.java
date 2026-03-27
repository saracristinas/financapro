package com.financapro.controller.divida;

import com.financapro.dto.divida.DividaRequestDto;
import com.financapro.dto.divida.DividaResponseDto;
import com.financapro.service.divida.DividaService;
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
@RequestMapping("/api/debts")
@RequiredArgsConstructor
public class DividasController {

    private final DividaService dividaService;

    @GetMapping
    public List<DividaResponseDto> list(@AuthenticationPrincipal UserDetails user) {
        return dividaService.getAll(user.getUsername());
    }

    @PostMapping
    public DividaResponseDto create(
        @AuthenticationPrincipal UserDetails user,
        @Valid @RequestBody DividaRequestDto req
    ) {
        return dividaService.create(user.getUsername(), req);
    }

    @PutMapping("/{id}")
    public DividaResponseDto update(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id,
        @Valid @RequestBody DividaRequestDto req
    ) {
        return dividaService.update(user.getUsername(), id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id
    ) {
        dividaService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}






