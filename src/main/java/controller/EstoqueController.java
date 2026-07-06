package controller;

import com.google.gson.Gson;
import dao.EstoqueDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.MovimentacaoModel;

import java.io.IOException;

@WebServlet("/estoque/*")
public class EstoqueController extends HttpServlet {

    private static final Gson gson = new Gson();
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws IOException {


        if (request.getPathInfo() == null || request.getPathInfo().length() < 2) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Produto inválido");
            return;
        }

        try {
            int produtoId = Integer.parseInt(request.getPathInfo().substring(1));

            MovimentacaoModel mov = gson.fromJson(request.getReader(), MovimentacaoModel.class);


            if (mov == null || mov.getTipo() == null || mov.getQuantidade() <= 0) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Dados inválidos");
                return;
            }

            String tipo = mov.getTipo().trim().toUpperCase();
            if (!tipo.equals("ENTRADA") && !tipo.equals("SAIDA")) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            EstoqueDAO dao = new EstoqueDAO();
            boolean ok = dao.ajustar(produtoId, tipo, mov.getQuantidade());

            if (ok) {
                response.setStatus(HttpServletResponse.SC_OK);
            } else {

                response.sendError(HttpServletResponse.SC_CONFLICT,
                        "Estoque insuficiente ou produto sem registro de estoque");
            }

        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Produto inválido");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Erro ao atualizar o estoque");
        }
    }
}
