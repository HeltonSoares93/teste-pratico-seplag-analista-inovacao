package dev.heltonsoares.backend_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import dev.heltonsoares.backend_app.dtos.SadtResponse;
import dev.heltonsoares.backend_app.service.SadtService;

@RestController
@RequestMapping("/sadt")
@CrossOrigin(origins = "*")
public class SadtController {

  @Autowired
  private SadtService sadtService;

  @GetMapping
  public ResponseEntity<PaginaResponse<SadtResponse>> listarUnidadesDaSaudeDaFamilia(
      @RequestParam(required = false) String nomeOficial,
      @RequestParam(required = false) String bairro,
      @RequestParam(required = false) String endereco,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {

    PaginaResponse<SadtResponse> dados = sadtService.listarSadts(bairro, endereco, nomeOficial, page, size);

    return ResponseEntity.ok(dados);
  }

}
