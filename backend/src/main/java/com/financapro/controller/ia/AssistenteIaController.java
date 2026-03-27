//package com.financapro.controller.ia;
//
//import com.financapro.dto.ia.IaChatRequestDto;
//import com.financapro.dto.ia.IaChatResponseDto;
//import com.financapro.service.ia.AssistenteIaService;
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/ai")
//@RequiredArgsConstructor
//public class AssistenteIaController {
//
//    private final AssistenteIaService assistenteIaService;
//
//    @PostMapping("/chat")
//    public IaChatResponseDto chat(@Valid @RequestBody IaChatRequestDto req) {
//        return assistenteIaService.chat(req);
//    }
//}
//


