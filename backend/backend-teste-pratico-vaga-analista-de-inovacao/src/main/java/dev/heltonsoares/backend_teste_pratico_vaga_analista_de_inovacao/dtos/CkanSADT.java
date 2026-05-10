// Serviço de Apoio Diagnóstico e Terapêutico 
/*
É uma modalidade de prestação de serviços que utiliza recursos físicos (RX, Ultrassonografia, Ressonância Magnética)
 com o objetivo de esclarecer o diagnóstico ou realizar procedimentos terapêuticos específicos para pacientes de um 
 serviço de saúde. Geralmente organiza-se por um sistema informatizado que registra a oferta dos serviços em determinadas 
 especialidades, sejam eles próprios, terceirizados ou contratados ao estabelecimento de saúde.
*/

package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CkanSADT(
        @JsonProperty("nome_oficial") String nomeOficial,
        Integer rpa,
        @JsonProperty("distrito_sanitario") Integer distritoSanitario,
        Integer microregiao,
        @JsonProperty("tipo_servico") String tipoServico,
        @JsonProperty("endereço") String endereco,
        String bairro,
        String fone,
        String servico,
        String especialidade,
        @JsonProperty("como_usar") String comoUsar,
        String horario) {

}
