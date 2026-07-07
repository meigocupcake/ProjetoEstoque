async function validarLogin() {
  try {
    const res = await fetch("http://localhost:8080/api/perfil");
    const dado = await res.json();
    const nomeUsuario = document.getElementById("nomeUsuario");
    const cargoUsuario = document.getElementById("cargoUsuario");
    const fotoPerfil = document.getElementById("fotoPerfil");

    nomeUsuario.innerText = dado.usuario;
    cargoUsuario.innerText = dado.perfil;
    fotoPerfil.innerText = dado.usuario.charAt(0).toUpperCase();


    console.log("PERFIL FRONT: ", dado.perfil);

    if (!dado.perfil || dado.perfil.toLowserCase() !== "administrador") {
      document.getElementsByClassName(".btn-menu").style.display = "nome";
    }
  } catch (e) {
    console.erro("Erro ao verificar o perfil.", e);
  }
}

validarLogin();
