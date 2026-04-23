package controller;

import dao.CadastroProdutosDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import javax.imageio.IIOException;
import model.CadastroProdutoModel;

/**
 *
 * @author 015.509576
 */
@WebServlet("/api/estoque")
public class EstoqueController extends HttpServlet{
     protected void doGet(HttpServletRequest request, HttpServletResponse response)
         throws IIOException, IOException{
         CadastroProdutosDAO dao = new CadastroProdutosDAO();
         List<CadastroProdutoModel> list = dao.listar();
         
         String json = new Gson().toJson(lista);
         
         response.setContentType("application/json");
         response.setCharacterEncoding("UTF-8");
         response.getWriter().write(json);
     }
     
    
}