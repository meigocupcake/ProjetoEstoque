package dao;

import connection.ConnectionFactory;
import model.OperacaoModel;
import model.ProdutoModel;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class OperacaoDAO {

    public boolean salvar(OperacaoModel operacao){
        String sql = "INSERT INTO operacoes" +
                "(id_produto, operacao, quantidade, data_operacao)" +
                "VALUES (?, ?, ?, ?)";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)
        ){
            stmt.setInt(1, operacao.getIdProduto());
            stmt.setString(2, operacao.getOperacao());
            stmt.setInt(3, operacao.getQuantidade());
            stmt.setDate(4, java.sql.Date.valueOf(operacao.getDataOperacao()));

            stmt.executeUpdate();
            return true;

        }catch(SQLException e){
            e.printStackTrace();
            return false;
        }

    }

    public List<OperacaoModel> getAll(){
        List<OperacaoModel> lista = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM operacoes");

        try {
            Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql.toString());

            ResultSet rs = stmt.executeQuery();

            while(rs.next()){
                OperacaoModel p = new OperacaoModel();
                p.setId(rs.getInt("id"));
                p.setIdProduto(rs.getInt("id_produto"));
                p.setOperacao(rs.getString("operacao"));
                p.setQuantidade(rs.getInt("quantidade"));
                p.setDataOperacao(rs.getDate("data_operacao").toString());

                lista.add(p);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return lista;

    }



}
