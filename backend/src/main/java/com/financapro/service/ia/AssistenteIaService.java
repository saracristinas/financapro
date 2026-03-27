//package com.financapro.service.ia;
//
//import com.financapro.dto.ia.IaChatRequestDto;
//import com.financapro.dto.ia.IaChatResponseDto;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//
//import java.util.*;
//
//@Service
//@RequiredArgsConstructor
//public class AssistenteIaService {
//
//    @Value("${openai.api-key}")
//    private String apiKey;
//
//    @Value("${openai.model:gpt-4o-mini}")
//    private String model;
//
//    private final WebClient webClient = WebClient.builder()
//            .baseUrl("https://api.openai.com")
//            .build();
//
//    public IaChatResponseDto chat(IaChatRequestDto req) {
//
//        List<Map<String, String>> messages = new ArrayList<>();
//
//        // system (instrução da IA)
//        messages.add(Map.of(
//                "role", "system",
//                "content",
//                "Você é um assistente financeiro pessoal chamado FinançaPro IA. " +
//                        "Ajude o usuário com análises financeiras, dicas de economia, planejamento de orçamento " +
//                        "e gestão de dívidas. Responda sempre em português brasileiro, de forma clara e objetiva. " +
//                        "Seja encorajador mas realista."
//        ));
//
//        // histórico
//        if (req.getHistory() != null) {
//            messages.addAll(req.getHistory());
//        }
//
//        // mensagem atual
//        messages.add(Map.of(
//                "role", "user",
//                "content", req.getMessage()
//        ));
//
//        Map<String, Object> body = new LinkedHashMap<>();
//        body.put("model", model);
//        body.put("messages", messages);
//        body.put("temperature", 0.7);
//
//        @SuppressWarnings("unchecked")
//        Map<String, Object> response = webClient.post()
//                .uri("/v1/chat/completions")
//                .header("Authorization", "Bearer " + apiKey)
//                .header("Content-Type", "application/json")
//                .bodyValue(body)
//                .retrieve()
//                .bodyToMono(Map.class)
//                .block();
//
//        String reply = "";
//
//        if (response != null && response.containsKey("choices")) {
//            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
//
//            if (!choices.isEmpty()) {
//                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
//                reply = (String) message.get("content");
//            }
//        }
//
//        IaChatResponseDto res = new IaChatResponseDto();
//        res.setReply(reply);
//
//        return res;
//    }
//}