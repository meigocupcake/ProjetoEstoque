let produtos = [];


function renderizar(lista, mensagemVazia){
    const tabela = document.getElementById("corpoTabela");
    tabela.innerHTML = "";

    if (lista.length === 0) {
        tabela.innerHTML =
            `<tr class="linhaVazia"><td colspan="11">${mensagemVazia}</td></tr>`;
        return;
    }

    lista.forEach(item =>{
        const linha = `
                   <tr>
                       <td>${item.codigoBarras}</td>
                       <td>${item.nomeProduto}</td>
                       <td>${item.quantidade ?? "-"}</td>
                       <td>R$ ${item.valor}</td>
                       <td>${item.fabricante}</td>
                       <td>${item.marca}</td>
                       <td>${item.localArmazenamento}</td>
                       <td>${item.minimoEstoque}</td>
                       <td>${item.status}</td>
                       <td>${item.dataFabricacao}</td>
                       <td>${item.dataVencimento}</td>
                   </tr>
                   `;
        tabela.innerHTML += linha;
    });
}


function mostrarAbaixo(){
    document.getElementById("btnAbaixo").classList.add("ativo");
    document.getElementById("btnProximo").classList.remove("ativo");
    document.getElementById("tabelaProdutos").classList.remove("temaAmarelo");

    const lista = produtos.filter(p =>
        Number(p.quantidade) < Number(p.minimoEstoque)
    );
    renderizar(lista, "Nenhum produto abaixo do estoque mínimo.");
}


function mostrarProximos(){
    document.getElementById("btnProximo").classList.add("ativo");
    document.getElementById("btnAbaixo").classList.remove("ativo");
    document.getElementById("tabelaProdutos").classList.add("temaAmarelo");

    const lista = produtos.filter(p => {
        const q = Number(p.quantidade);
        const min = Number(p.minimoEstoque);
        return q >= min && q <= min + 3;
    });
    renderizar(lista, "Nenhum produto próximo do estoque mínimo.");
}

async function carregarProdutos(){
    try{
        const response = await fetch("http://localhost:8080/produtos");
        produtos = await response.json();
        mostrarAbaixo();
    }catch(erro){
        console.log("Erro ao carregar os produtos", erro);
    }
}


window.onload = () => {
    carregarProdutos();
    document.getElementById("btnAbaixo").addEventListener("click", mostrarAbaixo);
    document.getElementById("btnProximo").addEventListener("click", mostrarProximos);
};
