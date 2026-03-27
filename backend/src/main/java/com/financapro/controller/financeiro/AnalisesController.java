package com.financapro.controller.financeiro;

import com.financapro.dto.financeiro.DadosMensaisDto;
import com.financapro.service.financeiro.AnaliseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalisesController {

    private final AnaliseService analiseService;

    @GetMapping("/monthly")
    public List<DadosMensaisDto> monthly(
        @AuthenticationPrincipal UserDetails user,
        @RequestParam int year
    ) {
        return analiseService.getAnnual(user.getUsername(), year);
    }
}





