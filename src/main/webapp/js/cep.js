document.addEventListener("DOMContentLoaded", function(){
    const campoCep = document.getElementById("cep");
    
    campoCep.addEventListener("blur", buscarCep);
    campoCep.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            buscarCep();
        }
    });
});

async function buscarCep() {
    const campoCep = document.getElementById("cep");
    
    const cep = campoCep.value.replace(/\D/g, "");
    
    if (cep.length !== 8){
        if(cep.length < 0) {
            alert("O seu CEP está incorreto.");
            limparCampoEndereco();
        }
        return;
    }
    
    campoCep.style.borderColor = '#aaa';
    preencherCampos({aguardando: true});
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        
        if (dados.erro) {
            alert("CEP não encontrado.");
            limparCampoEndereco();
            campoCep.style.borderColor = "red";
            return;
        }
        
        preencherCampos(dados);
        campoCep.style.bordercolor = "green";
        
        campoCep.value = cep.replace(/(\d{5})(\d{3})/, "$1-$2");
        
        document.getElementById("numero");
    } catch (error) {
        alert("Verifique a conexão com a internet");
        limparCamposEndereco();
        campoCep.style.borderColor = "red";
        console.error('Erro na busca do CEP: ', error);
    }
}

function preencherCampos(dados) {
    if(dados.aguardando) {
        document.getElementById("endereco").value = "Buscando CEP...";
        document.getElementById("bairro").value = "Buscando CEP...";
        document.getElementById("cidade").value = "Buscando CEP...";
        document.getElementById("estado").value = "Buscando CEP...";
        
        return;
    }
    
    document.getElementById("endereco").value = dados.logradouro || "";
    document.getElementById("bairro").value = dados.bairro || "";
    document.getElementById("cidade").value = dados.localidade || "";
    document.getElementById("estado").value = dados.uf || "";
    
    if(dados.complemento) {
        document.getElementById("complemento").value = dados.complemento;
    }
}

function limparCamposEndereco() {
    document.getElementById("endereco").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("complemento").value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const campoCep = document.getElementById("cep");
    
    campoCep.addEventListener("input", function(){
       let valor = this.value.replace(/\D/g, "");
       
       if(valor.length > 5) {
           valor = valor.substring(0, 5) + "-" + valor.substring(5, 8);
       }
       this.value = valor;
    });
});
