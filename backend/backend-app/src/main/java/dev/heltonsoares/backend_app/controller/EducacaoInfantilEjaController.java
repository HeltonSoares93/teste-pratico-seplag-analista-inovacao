package dev.heltonsoares.backend_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.heltonsoares.backend_app.dtos.EducacaoInfantilEjaResponse;
import dev.heltonsoares.backend_app.dtos.PaginaResponse;
import dev.heltonsoares.backend_app.service.EducacaoInfantilEjaService;

@RestController
@RequestMapping("/dados-educacao-infantil-eja")
@CrossOrigin(origins = "*")
public class EducacaoInfantilEjaController {

  @Autowired
  private EducacaoInfantilEjaService educacaoInfantilEjaService;

  @GetMapping
  public ResponseEntity<PaginaResponse<EducacaoInfantilEjaResponse>> listarUnidadesDaSaudeDaFamilia(
      @RequestParam(required = false) String unidadeEnsino,
      @RequestParam(required = false) String bairroEscola,
      @RequestParam(required = false) String modalidadeEnsino,
      @RequestParam(required = false) String sexo,
      @RequestParam(required = false) String raca,
      @RequestParam(required = false) Integer quantidade,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size
  ) {
    PaginaResponse<EducacaoInfantilEjaResponse> dados = educacaoInfantilEjaService.listarDados(
        unidadeEnsino, bairroEscola, modalidadeEnsino, sexo, raca, quantidade, page, size);

    return ResponseEntity.ok(dados);
  }

}
