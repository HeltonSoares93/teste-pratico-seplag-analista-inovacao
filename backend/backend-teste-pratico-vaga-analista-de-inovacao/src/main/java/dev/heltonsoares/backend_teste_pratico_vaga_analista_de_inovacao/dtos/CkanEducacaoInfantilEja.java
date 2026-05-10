package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CkanEducacaoInfantilEja(
    @JsonProperty("Unidade de Ensino") String unidadeEnsino,
    @JsonProperty("Bairro escola") String bairroEscola,
    @JsonProperty("modalidade_ensino") String modadalideEnsino,
    String sexo,
    String raca,
    Integer quantidade) {

}
