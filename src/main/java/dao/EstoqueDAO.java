package dao;

import connection.ConnectionFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class EstoqueDAO {
    public boolean ajustar(int id, String tipo, int quantidade) {

        final String sql;
        if ("ENTRADA".equalsIgnoreCase(tipo)) {
            sql = "UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?";
        } else {
            sql = "UPDATE produtos SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?";
        }

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, quantidade);
            stmt.setInt(2, id);

            if (!"ENTRADA".equalsIgnoreCase(tipo)) {
                stmt.setInt(3, quantidade);
            }

            int linhasAfetadas = stmt.executeUpdate();
            return linhasAfetadas > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
