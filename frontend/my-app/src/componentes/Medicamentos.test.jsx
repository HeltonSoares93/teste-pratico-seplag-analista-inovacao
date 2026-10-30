import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import Medicamentos from "./Medicamentos";

describe("Medicamentos", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ dados: [], pagina: 0, totalPaginas: 1 }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("renderiza o titulo e o botao Limpar Filtros", async () => {
    render(<Medicamentos />);

    expect(screen.getByText("Estoque de Medicamentos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpar Filtros" })).toBeInTheDocument();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("Nenhum medicamento encontrado.")).toBeInTheDocument();
  });
});
