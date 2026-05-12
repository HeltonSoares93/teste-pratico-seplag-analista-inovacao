// ServiÃ§o de Apoio DiagnÃ³stico e TerapÃªutico 
/*
Ã‰ uma modalidade de prestaÃ§Ã£o de serviÃ§os que utiliza recursos fÃ­sicos (RX, Ultrassonografia, RessonÃ¢ncia MagnÃ©tica)
 com o objetivo de esclarecer o diagnÃ³stico ou realizar procedimentos terapÃªuticos especÃ­ficos para pacientes de um 
 serviÃ§o de saÃºde. Geralmente organiza-se por um sistema informatizado que registra a oferta dos serviÃ§os em determinadas 
 especialidades, sejam eles prÃ³prios, terceirizados ou contratados ao estabelecimento de saÃºde.
*/

package dev.heltonsoares.backend_app.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CkanSADT(
        @JsonProperty("nome_oficial") String nomeOficial,
        Integer rpa,
        @JsonProperty("distrito_sanitario") Integer distritoSanitario,
        Integer microregiao,
        @JsonProperty("tipo_servico") String tipoServico,
        @JsonProperty("endereÃ§o") String endereco,
        String bairro,
        String fone,
        String servico,
        String especialidade,
        @JsonProperty("como_usar") String comoUsar,
        String horario) {

}
