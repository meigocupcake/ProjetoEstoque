package dao;

import connection.ConnectionFactory;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.UserModel;

public class UserDAO {
    
    public boolean  validarLogin(UserModel userModel) {
        String sql = 
                "SELECT * FROM users WHERE username= ?";
        
        try (var con = ConnectionFactory.getConnection()){
                        
            PreparedStatement stmt =
                    con.prepareStatement(sql);
            stmt.setString(1, userModel.getUsername());
            
            ResultSet rs = stmt.executeQuery();
            
            return rs.next();
   
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
