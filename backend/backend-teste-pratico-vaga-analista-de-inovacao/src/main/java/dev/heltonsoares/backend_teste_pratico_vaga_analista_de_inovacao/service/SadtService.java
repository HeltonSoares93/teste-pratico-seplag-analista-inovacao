package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.client.RecifeSADTApiClient;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.CkanSADTResponse;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.PaginaResponse;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.SadtResponse;

@Service
public class SadtService {

  private final RecifeSADTApiClient apiClient;
  private final List<SadtResponse> cache = new ArrayList<>();

  public SadtService(RecifeSADTApiClient apiClient) {
    this.apiClient = apiClient;
  }

  @PostConstruct
  public void inicializarCache() {
    int limit = 1000;
    int offset = 0;
    boolean temMais = true;

    System.out.println("Iniciando cache de SADTs...");
    while (temMais) {
      try {
        CkanSADTResponse response = apiClient.buscarDadosBrutos(limit, offset);
        if (response != null && response.success() && response.result() != null && response.result().records() != null) {
          List<SadtResponse> lote = response.result().records().stream()
              .map(ckan -> new SadtResponse(
                  ckan.nomeOficial(),
                  ckan.rpa(),
                  ckan.distritoSanitario(),
                  ckan.microregiao(),
                  ckan.tipoServico(),
                  ckan.endereco(),
                  ckan.bairro(),
                  ckan.fone(),
                  ckan.servico(),
                  ckan.especialidade(),
                  ckan.comoUsar(),
                  ckan.horario()))
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
        System.err.println("Erro ao buscar lote do CKAN SADT (offset " + offset + "): " + e.getMessage());
        temMais = false;
      }
    }
    System.out.println("Cache de SADTs finalizado. Total de registros: " + cache.size());
  }

  public PaginaResponse<SadtResponse> listarSadts(String bairro, String endereco, String nomeOficial, int page, int size) {
    List<SadtResponse> filtrados = cache.stream()
        .filter(ckan -> {
          if (bairro == null || bairro.isBlank()) return true;
          if (ckan.bairro() == null) return false;
          return ckan.bairro().toLowerCase().contains(bairro.toLowerCase());
        })
        .filter(ckan -> {
          if (endereco == null || endereco.isBlank()) return true;
          if (ckan.endereco() == null) return false;
          return ckan.endereco().toLowerCase().contains(endereco.toLowerCase());
        })
        .filter(ckan -> {
          if (nomeOficial == null || nomeOficial.isBlank()) return true;
          if (ckan.nomeOficial() == null) return false;
          return ckan.nomeOficial().toLowerCase().contains(nomeOficial.toLowerCase());
        })
        .collect(Collectors.toList());

    long total = filtrados.size();
    int totalPaginas = size > 0 ? (int) Math.ceil((double) total / size) : 1;

    List<SadtResponse> paginados = filtrados;
    if (size > 0 && page >= 0) {
      paginados = filtrados.stream()
          .skip((long) page * size)
          .limit(size)
          .collect(Collectors.toList());
    }

    return new PaginaResponse<>(paginados, total, page, size, totalPaginas);
  }
}
