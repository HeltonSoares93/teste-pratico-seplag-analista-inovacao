package dev.heltonsoares.backend_app.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import dev.heltonsoares.backend_app.dtos.CkanMedicamentoResponse;

@Component
public class RecifeMedicamentoApiClient {

  private final RestClient restClient;
  private static final String RESOURCE_MEDICAMENTOS_ID = "1b8142f9-d801-4b54-88ca-5a1df3bd6884";
  private static final int LIMIT = 40000;

  // configuraÃ§Ã£o da URL base
  public RecifeMedicamentoApiClient() {
    this.restClient = RestClient.create("https://dados.recife.pe.gov.br");
  }

  // Busca o JSON bruto com limite e offset
  public CkanMedicamentoResponse buscarDadosBrutos(int limit, int offset) {
    return restClient.get()
        .uri(uriBuilder -> uriBuilder
            .path("/api/action/datastore_search")
            .queryParam("resource_id", RESOURCE_MEDICAMENTOS_ID)
            .queryParam("limit", limit)
            .queryParam("offset", offset)
            .build())
        .retrieve().body(CkanMedicamentoResponse.class);
  }
}
