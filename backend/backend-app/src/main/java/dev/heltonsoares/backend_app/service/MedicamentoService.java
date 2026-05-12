package dev.heltonsoares.backend_app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.heltonsoares.backend_app.client.RecifeMedicamentoApiClient;
import dev.heltonsoares.backend_app.dtos.CkanMedicamentoResponse;
import dev.heltonsoares.backend_app.dtos.MedicamentoResponse;
import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import jakarta.annotation.PostConstruct;

@Service
public class MedicamentoService {

  private final RecifeMedicamentoApiClient apiClient;
  private final List<MedicamentoResponse> cache = new ArrayList<>();

  public MedicamentoService(RecifeMedicamentoApiClient apiClient) {
    this.apiClient = apiClient;
  }

  @PostConstruct
  public void inicializarCache() {
    int limit = 1000;
    int offset = 0;
    boolean temMais = true;

    System.out.println("Iniciando cache de Medicamentos...");
    while (temMais) {
      try {
        CkanMedicamentoResponse response = apiClient.buscarDadosBrutos(limit, offset);
        if (response != null && response.success() && response.result() != null
            && response.result().records() != null) {
          List<MedicamentoResponse> lote = response.result().records().stream()
              .map(ckan -> new MedicamentoResponse(
                  ckan.distrito(),
                  ckan.bairro(),
                  ckan.unidade(),
                  ckan.tipoProduto(),
                  ckan.produto(),
                  converterQuantidade(ckan.quantidade())))
              .toList();

          cache.addAll(lote);
          offset += lote.size();

          if (lote.isEmpty()) {
            temMais = false; // Fim dos registros
          }
        } else {
          temMais = false;
        }
      } catch (Exception e) {
        System.err.println("Erro ao buscar lote do CKAN (offset " + offset + "): " + e.getMessage());
        temMais = false; // Interrompe em caso de erro para nÃ£o ficar em loop infinito
      }
    }
    System.out.println("Cache de Medicamentos finalizado. Total de registros: " + cache.size());
  }

  public PaginaResponse<MedicamentoResponse> listarMedicamentos(String bairro, String medicamento, String codigo,
      Integer qtdSuperior, Integer qtdInferior, String ordem, int page, int size) {

    List<MedicamentoResponse> filtrados = cache.stream()
        .filter(ckan -> {
          if (bairro == null || bairro.isBlank())
            return true;
          if (ckan.bairro() == null)
            return false;
          return ckan.bairro().toLowerCase().contains(bairro.toLowerCase());
        })
        .filter(ckan -> {
          if (medicamento == null || medicamento.isBlank())
            return true;
          if (ckan.produto() == null)
            return false;
          return ckan.produto().toLowerCase().contains(medicamento.toLowerCase());
        })
        .filter(ckan -> {
          if (codigo == null || codigo.isBlank())
            return true;
          
          if (ckan.produto() == null)
            return false;
          return ckan.produto().contains(codigo);
        })
        .filter(ckan -> {
          if (qtdSuperior == null)
            return true;
          return ckan.quantidade() >= qtdSuperior;
        })
        .filter(ckan -> {
          if (qtdInferior == null)
            return true;
          return ckan.quantidade() <= qtdInferior;
        })
        .collect(Collectors.toList());

    if ("asc".equalsIgnoreCase(ordem)) {
      filtrados.sort(java.util.Comparator.comparing(MedicamentoResponse::quantidade));
    } else if ("desc".equalsIgnoreCase(ordem)) {
      filtrados.sort(java.util.Comparator.comparing(MedicamentoResponse::quantidade).reversed());
    }

    long total = filtrados.size();
    int totalPaginas = size > 0 ? (int) Math.ceil((double) total / size) : 1;

    List<MedicamentoResponse> paginados = filtrados;
    if (size > 0 && page >= 0) {
      paginados = filtrados.stream()
          .skip((long) page * size)
          .limit(size)
          .collect(Collectors.toList());
    }

    return new PaginaResponse<>(paginados, total, page, size, totalPaginas);
  }

  private Double converterQuantidade(String quantidadeStr) {
    if (quantidadeStr == null || quantidadeStr.trim().isEmpty()) {
      return 0.0;
    }
    try {
      String formatado = quantidadeStr.replace(",", ".");
      return Double.parseDouble(formatado);
    } catch (NumberFormatException e) {
      return 0.0;
    }
  }

}
