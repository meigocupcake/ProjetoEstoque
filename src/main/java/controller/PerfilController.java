package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/api/perfil")
public class PerfilController extends HttpServlet{

    private final Gson gson = new Gson();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        HttpSession session = request.getSession(false);

        String usuario = (String) session.getAttribute("usuario");
        String perfil = (String) session.getAttribute("perfil");

        JsonObject json = new JsonObject();
        json.addProperty("usuario", usuario);
        json.addProperty("perfil", perfil);

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(json));
        
    }
}
