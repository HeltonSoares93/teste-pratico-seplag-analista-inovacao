package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos;

import java.util.List;

public record MedicamentoPaginadoResponse(
    List<MedicamentoResponse> dados,
    int total,
    int pagina,
    int itensPorPagina,
    int totalPaginas) {

}
