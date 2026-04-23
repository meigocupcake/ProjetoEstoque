/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;
import org.mindrot.jbcrypt.BCrypt;

/**
 *
 * @author 015.509576
 */
public class SenhaUtil {
    public static String gerarHash(String senha){
        return BCrypt.hashpw(senha, BCrypt.gensalt());
    }
    
    public static boolean verificarSenha(String senhaDigitada, String hash){
        return BCrypt.checkpw(senhaDigitada, hash);
    }
}
