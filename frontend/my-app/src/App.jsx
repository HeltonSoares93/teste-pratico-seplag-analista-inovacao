import { useEffect, useState } from "react"
import axios from "axios";
import MenuNav from "./componentes/MenuNav";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Sobre from "./componentes/Sobre";
import Medicamentos from "./componentes/Medicamentos";
import UnidadesDistribuicaoPreservativos from "./componentes/UnidadesDistribuicaoPreservativos";
import UnidadesSaudeDaFamilia from "./componentes/UnidadesSaudeDaFamilia";
import Painel from "./componentes/Painel";
import ServicosApoioDiagnosticoTerapeutico from "./componentes/ServicosApoioDiagnosticoTerapeutico";
import EducacaoInfantilEja from "./componentes/EducacaoInfantilEja";


export default function App() {

  // const [dados, setDados] = useState([]);

  // const buscarDados = () => {
  //   fetch("http://localhost:8080/medicamentos")
  //     .then(resposta => {
  //       if (!resposta.ok) {
  //         throw new Error("Não foi possível buscar os dados no momento, tente novamente.")
  //       };
  //       return resposta.json();
  //     })
  //     .then(dados => {
  //       setDados(dados);
  //     }).catch(erro => {
  //       console.error("Erro na comunicação com a API: ", erro);
  //     })
  // }

  // useEffect(() => {
  //   buscarDados();
  // }, [])

  return (

    <Container>
      <MenuNav />

      <Routes>
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/medicamentos" element={<Medicamentos />} />
        <Route path="/unidadesdistribuicaopreservativos" element={<UnidadesDistribuicaoPreservativos />} />
        <Route path="/unidadessaudedafamilia" element={<UnidadesSaudeDaFamilia />} />
        <Route path="/servicosdeapoiodiagnosticoeterapeutico" element={<ServicosApoioDiagnosticoTerapeutico />} />
        <Route path="/educacaoinfantileja" element={<EducacaoInfantilEja />} />
        <Route path="/painel" element={<Painel />} />

      </Routes>

    </Container>


  )
}