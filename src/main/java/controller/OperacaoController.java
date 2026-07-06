package controller;

import com.google.gson.Gson;
import dao.CadastroProdutosDAO;
import dao.OperacaoDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.OperacaoModel;
import model.ProdutoModel;

import java.io.IOException;
import java.util.List;

@WebServlet("/operacoes")
public class OperacaoController extends HttpServlet {

    private static final Gson gson = new Gson();

    private final OperacaoDAO dao = new OperacaoDAO();
    private final CadastroProdutosDAO daoCad = new CadastroProdutosDAO();

    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws  SecurityException, IOException{
        OperacaoModel operacao = gson.fromJson(request.getReader(), OperacaoModel.class);
        ProdutoModel produto = daoCad.getById(operacao.getIdProduto());

        if(produto == null){
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Produto não encontrado.");
            return;
        }

        String tipo = operacao.getOperacao().toUpperCase();

        int quantidade = produto.getQuantidade();

        if(tipo.equals("ENTRADA")){
            quantidade += operacao.getQuantidade();
        }else{
            quantidade -= operacao.getQuantidade();
        }

        produto.setQuantidade(quantidade);

        if(!daoCad.atualizar(produto)){
            response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Erro ao atualizar produto.");
            return;
        }

        if(dao.salvar(operacao)){
            response.setStatus(HttpServletResponse.SC_CREATED);
        }else{
            response.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
        }
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException{

        List<OperacaoModel> lista = dao.getAll();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(lista));

    }

}

