async function validarLogin(){
    try{
        const res = await fetch("http://localhost:8080/api/perfil");
        const dado = await res.json();
        
        console.log("PERFIL FRONT: ", dado.perfil);
        
        if(!dado.perfil || dado.perfil.toLowserCase() !== "admin"){
            document.getElementsByClassName(".btn-menu").style.display = "nome";
        }
    }catch (e) {
        console.erro("Erro ao verificar o perfil.", e);
    }
}

validarLogin();