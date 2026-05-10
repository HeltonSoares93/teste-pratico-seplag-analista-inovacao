package dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.MedicamentoResponse;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.dtos.PaginaResponse;
import dev.heltonsoares.backend_teste_pratico_vaga_analista_de_inovacao.service.MedicamentoService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/medicamentos")
public class MedicamentoController {

  @Autowired
  private MedicamentoService medicamentoService;

  @GetMapping
  public ResponseEntity<PaginaResponse<MedicamentoResponse>> listarTodosMedicamentos(
      @RequestParam(required = false) String bairro,
      @RequestParam(required = false) String medicamento,
      @RequestParam(required = false) String codigo,
      @RequestParam(required = false) Integer qtdSuperior,
      @RequestParam(required = false) Integer qtdInferior,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {

    PaginaResponse<MedicamentoResponse> dados = medicamentoService.listarMedicamentos(
        bairro, medicamento, codigo, qtdSuperior, qtdInferior, page, size);

    return ResponseEntity.ok(dados);
  }
}
