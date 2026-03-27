package com.financapro.controller.financeiro;

import com.financapro.dto.financeiro.PainelResponseDto;
import com.financapro.service.financeiro.TransacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class PainelController {

    private final TransacaoService transacaoService;

    @GetMapping
    public PainelResponseDto dashboard(
        @AuthenticationPrincipal UserDetails user,
        @RequestParam int month,
        @RequestParam int year
    ) {
        return transacaoService.getDashboard(user.getUsername(), month, year);
    }
}





