package dao;

import connection.ConnectionFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.ProdutoModel;

public class CadastroProdutosDAO {
        public boolean salvar(ProdutoModel produto){
        String sql = "INSERT INTO produtos" + 

                "(codigo_barras, nome_produto, fabricante, marca, valor, status, local_armazenamento, minimo_estoque, data_vencimento, data_fabricacao, quantidade)" +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

               
        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)
        ){
            
            stmt.setString(1, produto.getCodigoBarras());
            stmt.setString(2, produto.getNomeProduto());
            stmt.setString(3, produto.getFabricante());
            stmt.setString(4, produto.getMarca());
            stmt.setString(5, produto.getValor());
            stmt.setString(6, produto.getStatus());
            stmt.setString(7, produto.getLocalArmazenamento());
            stmt.setLong(8, produto.getMinimoEstoque());
            stmt.setDate(9, java.sql.Date.valueOf(produto.getDataVencimento()));
            stmt.setDate(10, java.sql.Date.valueOf(produto.getDataFabricacao()));
            stmt.setLong(11, produto.getQuantidade());


            
            stmt.executeUpdate();
            
            return true;
          
        }catch(SQLException e){
            e.printStackTrace();
            return false;
        }
                
    }

    public boolean atualizar(ProdutoModel produto){
        String sql = "UPDATE produtos SET " +
                "codigo_barras = ?," +
                "nome_produto = ?, " +
                "fabricante = ?, " +
                "marca = ?, " +
                "valor = ?, " +
                "status = ?, " +
                "local_armazenamento = ?, " +
                "minimo_estoque = ?, " +
                "data_vencimento = ?, " +
                "data_fabricacao = ?, " +
                "quantidade = ? " +
                "WHERE id = ?";

        System.out.println(sql);

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)
        ){

            stmt.setString(1, produto.getCodigoBarras());
            stmt.setString(2, produto.getNomeProduto());
            stmt.setString(3, produto.getFabricante());
            stmt.setString(4, produto.getMarca());
            stmt.setString(5, produto.getValor());
            stmt.setString(6, produto.getStatus());
            stmt.setString(7, produto.getLocalArmazenamento());
            stmt.setLong(8, produto.getMinimoEstoque());
            stmt.setDate(9, java.sql.Date.valueOf(produto.getDataVencimento()));
            stmt.setDate(10, java.sql.Date.valueOf(produto.getDataFabricacao()));
            stmt.setLong(11, produto.getQuantidade());
            stmt.setInt(12, produto.getId());

            stmt.executeUpdate();

            return true;

        }catch(SQLException e){
            e.printStackTrace();
            return false;
        }

    }

    public boolean deletar(int id) {
        String sql = "DELETE FROM produtos WHERE id = ?";

        System.out.println(sql);

        try (Connection conn = ConnectionFactory.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)
        ) {

            stmt.setInt(1, id);
            System.out.println(stmt.toString());

            stmt.executeUpdate();

            return true;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public ProdutoModel getById(int id){
        StringBuilder sql = new StringBuilder("SELECT * FROM produtos WHERE id = ?");

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql.toString())){
            stmt.setInt(1, id);

            ResultSet rs = stmt.executeQuery();
            while(rs.next()){
                ProdutoModel p = new ProdutoModel();

                p.setId(rs.getInt("id"));
                p.setCodigoBarras(rs.getString("codigo_barras"));
                p.setNomeProduto(rs.getString("nome_produto"));
                p.setFabricante(rs.getString("fabricante"));
                p.setMarca(rs.getString("marca"));
                p.setValor(rs.getString("valor"));
                p.setStatus(rs.getString("status"));
                p.setLocalArmazenamento(rs.getString("local_armazenamento"));
                p.setMinimoEstoque(rs.getLong("minimo_estoque"));
                p.setDataVencimento(rs.getDate("data_vencimento").toString());
                p.setDataFabricacao(rs.getDate("data_fabricacao").toString());
                p.setQuantidade(rs.getInt("quantidade"));

                return p;
            }

        }catch(SQLException e){
            e.printStackTrace();

        }
        return null;
    }

    public List<ProdutoModel> getByBusca(String value){
            List<ProdutoModel> lista = new ArrayList<>();
            StringBuilder sql = new StringBuilder("SELECT * FROM produtos WHERE nome_produto LIKE ? OR codigo_barras LIKE ?");
            String searchValue = "%"+value+"%";

        try(Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql.toString())){
            stmt.setString(1, searchValue);
            stmt.setString(2, searchValue);

            ResultSet rs = stmt.executeQuery();
            while(rs.next()){
                ProdutoModel p = new ProdutoModel();

                p.setId(rs.getInt("id"));
                p.setCodigoBarras(rs.getString("codigo_barras"));
                p.setNomeProduto(rs.getString("nome_produto"));
                p.setFabricante(rs.getString("fabricante"));
                p.setMarca(rs.getString("marca"));
                p.setValor(rs.getString("valor"));
                p.setStatus(rs.getString("status"));
                p.setLocalArmazenamento(rs.getString("local_armazenamento"));
                p.setMinimoEstoque(rs.getLong("minimo_estoque"));
                p.setDataVencimento(rs.getDate("data_vencimento").toString());
                p.setDataFabricacao(rs.getDate("data_fabricacao").toString());
                p.setQuantidade(rs.getInt("quantidade"));

                lista.add(p);
            }

        }catch(SQLException e){
            e.printStackTrace();

        }

        return lista;
    }

    public List<ProdutoModel> getAll(){
        List<ProdutoModel> lista = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM produtos");

        try {
            Connection conn = ConnectionFactory.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql.toString());

            ResultSet rs = stmt.executeQuery();

            while(rs.next()){
                ProdutoModel p = new ProdutoModel();
                p.setId(rs.getInt("id"));
                p.setCodigoBarras(rs.getString("codigo_barras"));
                p.setNomeProduto(rs.getString("nome_produto"));
                p.setFabricante(rs.getString("fabricante"));
                p.setMarca(rs.getString("marca"));
                p.setValor(rs.getString("valor"));
                p.setStatus(rs.getString("status"));
                p.setLocalArmazenamento(rs.getString("local_armazenamento"));
                p.setMinimoEstoque(rs.getLong("minimo_estoque"));
                p.setDataVencimento(rs.getDate("data_vencimento").toString());
                p.setDataFabricacao(rs.getDate("data_fabricacao").toString());
                p.setQuantidade(rs.getInt("quantidade"));

                lista.add(p);
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return lista;

    }
}
