package com.financapro.service.compartilhado;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String emailRemetente;

    /**
     * Envia email de convite para equipe
     * Retorna resultado com status de sucesso/erro
     */
    public EmailResultado enviarConviteEquipe(String emailDestinatario, String nomeConvidador, String linkAceitar) {
        log.info("[EMAIL-CONVITE] 📧 Iniciando envio de convite para: {}", emailDestinatario);
        
        try {
            // Validar se as credenciais estão configuradas
            if (emailRemetente == null || emailRemetente.isBlank()) {
                String msg = "Credenciais de email não configuradas no servidor - configure MAIL_USERNAME no ambiente";
                log.error("[EMAIL-CONVITE] ❌ ERRO - {}", msg);
                return EmailResultado.erro(msg);
            }

            log.debug("[EMAIL-CONVITE] 🔧 Preparando email para envio de: {} para: {}", emailRemetente, emailDestinatario);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(emailRemetente);
            message.setTo(emailDestinatario);
            message.setSubject("🎉 Convite para FinançaPro - Equipe");
            message.setText(construirMensagemConvite(nomeConvidador, linkAceitar));

            mailSender.send(message);
            
            String mensagem = "✅ Email de convite enviado com SUCESSO para: " + emailDestinatario;
            log.info("[EMAIL-CONVITE] ✅ SUCESSO - Email enviado para: {} via servidor: {}", emailDestinatario, emailRemetente);
            return EmailResultado.sucesso(mensagem);

        } catch (Exception e) {
            String msgErro = "Falha ao enviar email para " + emailDestinatario + " - " + e.getClass().getSimpleName();
            log.error("[EMAIL-CONVITE] ❌ ERRO - Destinatário: {}, Tipo: {}, Mensagem: {}", 
                    emailDestinatario, e.getClass().getSimpleName(), e.getMessage(), e);
            return EmailResultado.erro(msgErro);
        }
    }

    private String construirMensagemConvite(String nomeConvidador, String linkAceitar) {
        return "Olá!\n\n" +
                nomeConvidador + " te convidou para fazer parte de sua equipe no FinançaPro!\n\n" +
                "FinançaPro é uma plataforma completa de gerenciamento financeiro pessoal e em equipe.\n\n" +
                "Clique no link abaixo para aceitar o convite:\n" +
                linkAceitar + "\n\n" +
                "Se você não esperava esse convite, pode ignorar este email.\n\n" +
                "---\n" +
                "FinançaPro Team\n" +
                "https://financapro-1.onrender.com";
    }
}





