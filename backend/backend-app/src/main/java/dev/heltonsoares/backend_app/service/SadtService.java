package dev.heltonsoares.backend_app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import dev.heltonsoares.backend_app.client.RecifeSADTApiClient;
import dev.heltonsoares.backend_app.dtos.CkanSADTResponse;
import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import dev.heltonsoares.backend_app.dtos.SadtResponse;

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

  public PaginaResponse<SadtResponse> listarSadts(String bairro, String endereco, String nomeOficial, String especialidade, String horario, int page, int size) {
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
        .filter(ckan -> {
          if (especialidade == null || especialidade.isBlank()) return true;
          if (ckan.especialidade() == null) return false;
          return ckan.especialidade().toLowerCase().contains(especialidade.toLowerCase());
        })
        .filter(ckan -> {
          if (horario == null || horario.isBlank()) return true;
          if (ckan.horario() == null) return false;
          return ckan.horario().toLowerCase().contains(horario.toLowerCase());
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

  public List<String> listarHorariosDisponiveis() {
    return cache.stream()
        .map(SadtResponse::horario)
        .filter(h -> h != null && !h.isBlank())
        .distinct()
        .sorted()
        .collect(Collectors.toList());
  }
}
