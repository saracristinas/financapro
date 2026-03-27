package com.financapro.controller.financeiro;

import com.financapro.dto.financeiro.TransacaoRequestDto;
import com.financapro.dto.financeiro.TransacaoResponseDto;
import com.financapro.service.financeiro.TransacaoService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransacoesController {

    private final TransacaoService transacaoService;

    @GetMapping
    public List<TransacaoResponseDto> list(
        @AuthenticationPrincipal UserDetails user,
        @RequestParam int month,
        @RequestParam int year
    ) {
        return transacaoService.getByMonthYear(user.getUsername(), month, year);
    }

    @PostMapping
    public TransacaoResponseDto create(
        @AuthenticationPrincipal UserDetails user,
        @Valid @RequestBody TransacaoRequestDto req
    ) {
        return transacaoService.create(user.getUsername(), req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id
    ) {
        transacaoService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}






