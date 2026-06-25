package controller;

import com.google.gson.Gson;
import dao.CadastroProdutosDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ProdutoModel;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

@WebServlet("/produtos/*")
public class CadastroProdutoController extends HttpServlet{

    private static final Gson gson = new Gson();

    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException{

        CadastroProdutosDAO dao = new CadastroProdutosDAO();

        // busca sem ID
        if (request.getPathInfo() == null || request.getPathInfo().length() < 2) {
            List<ProdutoModel> lista = dao.getAll();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(gson.toJson(lista));
            return;
        }

        int id = Integer.parseInt(request.getPathInfo().substring(1));


        ProdutoModel produto = dao.getById(id);
        if(produto == null){
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Produto não encontrado");
            return;
        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(produto));
    }

    public void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (request.getPathInfo() == null || request.getPathInfo().length() < 2) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
            return;
        }

        try{
            int id = Integer.parseInt(request.getPathInfo().substring(1));

            CadastroProdutosDAO dao = new CadastroProdutosDAO();
            ProdutoModel produto = dao.getById(id);

            if(produto == null){
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Produto não encontrado");
                return;
            }

            Gson gson = new Gson();

            BufferedReader reader = request.getReader();
            ProdutoModel produtoRequest = gson.fromJson(reader, ProdutoModel.class);

            produto.setCodigoBarras(produtoRequest.getCodigoBarras());
            produto.setNomeProduto(produtoRequest.getNomeProduto());
            produto.setFabricante(produtoRequest.getFabricante());
            produto.setMarca(produtoRequest.getMarca());
            produto.setDataFabricacao(produtoRequest.getDataFabricacao());
            produto.setDataVencimento(produtoRequest.getDataVencimento());
            produto.setValor(produtoRequest.getValor());
            produto.setStatus(produtoRequest.getStatus());
            produto.setLocalArmazenamento(produtoRequest.getLocalArmazenamento());
            produto.setMinimoEstoque(produtoRequest.getMinimoEstoque());

            if(dao.atualizar(produto)){
                response.sendRedirect("pages/dashboard.html");
            }else{
                response.sendRedirect("pages/cadastroProdutos.html");
            }

        }catch(Exception e){
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
        }



    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException{


        try{
            if (request.getPathInfo() == null || request.getPathInfo().length() < 2) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID inválido");
                return;

            }

            int id = Integer.parseInt(request.getPathInfo().substring(1));

            CadastroProdutosDAO dao = new CadastroProdutosDAO();
            ProdutoModel produto = dao.getById(id);

            if(produto == null){
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Produto não encontrado");
                return;
            }

          System.out.println("id: " + id);

            if (dao.deletar(id)) {
                response.sendRedirect("pages/dashboard.html");
            } else {
                response.sendRedirect("pages/cadastroProdutos.html");
            }

        }catch(Exception e){

          System.out.println("Erro ao deletar!");
        }

    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
            ProdutoModel produto = gson.fromJson(request.getReader(), ProdutoModel.class);
//
//            ProdutoModel produto = new ProdutoModel();
//
//
//            produto.setCodigoBarras(request.getParameter("codigoBarras"));
//            produto.setNomeProduto(request.getParameter("nomeProduto"));
//            produto.setFabricante(request.getParameter("fabricante"));
//            produto.setMarca(request.getParameter("marca"));
//            produto.setDataFabricacao(request.getParameter("dataFabricacao"));
//            produto.setDataVencimento(request.getParameter("dataVencimento"));
//            produto.setValor(request.getParameter("valor"));
//            produto.setStatus(request.getParameter("status"));
//            produto.setLocalArmazenamento(request.getParameter("localArmazenamento"));
//            produto.setMinimoEstoque(Long.parseLong(request.getParameter("minimoEstoque")));
//
            CadastroProdutosDAO dao = new CadastroProdutosDAO();
            
            if(dao.salvar(produto)){
                response.sendRedirect("pages/dashboard.html");
            }else{
                response.sendRedirect("pages/cadastroProdutos.html");
            }
        }
    }
