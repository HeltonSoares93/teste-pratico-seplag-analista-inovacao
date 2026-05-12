package dev.heltonsoares.backend_app.dtos;

public record MedicamentoResponse(
    String distrito,
    String bairro,
    String unidade,
    String tipoProduto,
    String produto,
    Double quantidade) {

}
