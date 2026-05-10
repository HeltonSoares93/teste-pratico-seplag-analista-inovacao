package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.CkanEducacaoInfantilEjaResponse;

@Component
public class RecifeEducacaoInfantilEjaApiClient {

  private final RestClient restClient;
  private static final String RESOURCE_USF_ID = "bbbc3f99-9db3-4931-9975-f30af13acea0";
  private static final int LIMIT = 1000;

  // configuração da URL base
  public RecifeEducacaoInfantilEjaApiClient() {
    this.restClient = RestClient.create("https://dados.recife.pe.gov.br");
  }

  // Busca o JSON bruto com limit e offset
  public CkanEducacaoInfantilEjaResponse buscarDadosBrutos(int limit, int offset) {
    return restClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/api/action/datastore_search")
            .queryParam("resource_id", RESOURCE_USF_ID)
            .queryParam("limit", limit)
            .queryParam("offset", offset)
            .build())
        .retrieve().body(CkanEducacaoInfantilEjaResponse.class);
  }
}
