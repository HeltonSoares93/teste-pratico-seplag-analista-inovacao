package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.client.RecifeEducacaoInfantilEjaApiClient;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.CkanEducacaoInfantilEjaResponse;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.EducacaoInfantilEjaResponse;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.PaginaResponse;

@Service
public class EducacaoInfantilEjaService {

  private final RecifeEducacaoInfantilEjaApiClient apiClient;
  private final List<EducacaoInfantilEjaResponse> cache = new ArrayList<>();

  public EducacaoInfantilEjaService(RecifeEducacaoInfantilEjaApiClient apiClient) {
    this.apiClient = apiClient;
  }

  @PostConstruct
  public void inicializarCache() {
    int limit = 1000;
    int offset = 0;
    boolean temMais = true;

    System.out.println("Iniciando cache de Educação Infantil/EJA...");
    while (temMais) {
      try {
        CkanEducacaoInfantilEjaResponse response = apiClient.buscarDadosBrutos(limit, offset);
        if (response != null && response.success() && response.result() != null && response.result().records() != null) {
          List<EducacaoInfantilEjaResponse> lote = response.result().records().stream()
              .map(ckan -> new EducacaoInfantilEjaResponse(
                  ckan.unidadeEnsino(),
                  ckan.bairroEscola(),
                  ckan.modadalideEnsino(),
                  ckan.sexo(),
                  ckan.raca(),
                  ckan.quantidade()))
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
        System.err.println("Erro ao buscar lote do CKAN Educação Infantil (offset " + offset + "): " + e.getMessage());
        temMais = false;
      }
    }
    System.out.println("Cache de Educação Infantil/EJA finalizado. Total de registros: " + cache.size());
  }

  public PaginaResponse<EducacaoInfantilEjaResponse> listarDados(
      String unidadeEnsino,
      String bairroEscola,
      String modalidadeEnsino,
      String sexo,
      String raca,
      Integer quantidade,
      int page, int size
  ) {
    List<EducacaoInfantilEjaResponse> filtrados = cache.stream()
        .filter(ckan -> {
          if (unidadeEnsino == null || unidadeEnsino.isBlank()) return true;
          if (ckan.unidadeEnsino() == null) return false;
          return ckan.unidadeEnsino().toLowerCase().contains(unidadeEnsino.toLowerCase());
        })
        .filter(ckan -> {
          if (bairroEscola == null || bairroEscola.isBlank()) return true;
          if (ckan.bairroEscola() == null) return false;
          return ckan.bairroEscola().toLowerCase().contains(bairroEscola.toLowerCase());
        })
        .filter(ckan -> {
          if (modalidadeEnsino == null || modalidadeEnsino.isBlank()) return true;
          if (ckan.modalidadeEnsino() == null) return false; // Nota: campo mapeado no Response é modalidadeEnsino
          return ckan.modalidadeEnsino().toLowerCase().contains(modalidadeEnsino.toLowerCase());
        })
        .filter(ckan -> {
          if (sexo == null || sexo.isBlank()) return true;
          if (ckan.sexo() == null) return false;
          return ckan.sexo().toLowerCase().contains(sexo.toLowerCase());
        })
        .filter(ckan -> {
          if (raca == null || raca.isBlank()) return true;
          if (ckan.raca() == null) return false;
          return ckan.raca().toLowerCase().contains(raca.toLowerCase());
        })
        .filter(ckan -> {
          if (quantidade == null) return true;
          if (ckan.quantidade() == null) return false;
          return ckan.quantidade().equals(quantidade);
        })
        .collect(Collectors.toList());

    long total = filtrados.size();
    int totalPaginas = size > 0 ? (int) Math.ceil((double) total / size) : 1;

    List<EducacaoInfantilEjaResponse> paginados = filtrados;
    if (size > 0 && page >= 0) {
      paginados = filtrados.stream()
          .skip((long) page * size)
          .limit(size)
          .collect(Collectors.toList());
    }

    return new PaginaResponse<>(paginados, total, page, size, totalPaginas);
  }
}
