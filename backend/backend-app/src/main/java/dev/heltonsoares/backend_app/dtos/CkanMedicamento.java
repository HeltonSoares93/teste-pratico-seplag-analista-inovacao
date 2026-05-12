package dev.heltonsoares.backend_app.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CkanMedicamento(
    String distrito,
    String bairro,
    String unidade,
    String classe,
    String apresentacao,
    @JsonProperty("tipo_produto") String tipoProduto,
    @JsonProperty("codigo_produto") String codigoProduto,
    String produto,
    String cadum,
    @JsonProperty("data_carga") String dataCarga,
    String quantidade) {

}
