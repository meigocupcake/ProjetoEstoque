let produtosCarregados = [];

async function carregarEstoque(){
    try{
        const response = await fetch("http://localhost:8080/produtos");
        const dados = await response.json();
        produtosCarregados = dados;

        const tabela = document.getElementById("corpoTabela");
        tabela.innerHTML = "";

        const selectProdutoEntrada = document.getElementById("produtoEntrada");
        selectProdutoEntrada.innerHTML = '<option value="">-- Escolha um produto --</option>';

        const selectProdutoSaida = document.getElementById("produtoSaida");
        selectProdutoSaida.innerHTML = '<option value="">-- Escolha um produto --</option>';

        dados.forEach(item =>{
            const linha = `
                   <tr>
                       <td>${item.codigoBarras}</td>
                       <td>${item.nomeProduto}</td>
                       <td>R$ ${item.valor}</td>
                       <td>${item.fabricante}</td>
                       <td>${item.marca}</td>
                       <td>${item.localArmazenamento}</td>
                       <td>${item.status}</td>
                       <td class="acoesTabela">
                           <button type="button" class="btnAcao btnEditar" title="Editar" data-codigo="${item.id}">
                               <img src="../img/editar.png" alt="Editar" />
                           </button>
                           <button type="button" class="btnAcao btnExcluir" title="Excluir" data-codigo="${item.id}">
                               <img src="../img/excluir.png" alt="Excluir" />
                           </button>
                       </td>
                   </tr>
                   `;
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.nomeProduto;
            const optionSaida = option.cloneNode(true);
            selectProdutoEntrada.appendChild(option);
            selectProdutoSaida.appendChild(optionSaida);
            tabela.innerHTML += linha;
        });


    }catch(erro){
        console.log("Erro ao carregar os produtos", erro);
    }
}

async function carregarResumo(){
    try{
        const response = await fetch("http://localhost:8080/api/resumo");

        if (!response.ok) {
            console.log("Resumo indisponível (status " + response.status + ")");
            return;
        }

        const tipoConteudo = response.headers.get("content-type") || "";
        if (!tipoConteudo.includes("application/json")) {
            console.log("O endpoint /api/resumo não retornou JSON — resumo ignorado por enquanto.");
            return;
        }

        const dados = await response.json();

        const cardEntrada = document.getElementById("cardEntrada");
        const cardSaida   = document.getElementById("cardSaida");
        const cardTotal   = document.getElementById("cardTotal");
        if (cardEntrada) cardEntrada.innerHTML = dados.entradaVal;
        if (cardSaida)   cardSaida.innerHTML   = dados.saidaVal;
        if (cardTotal)   cardTotal.innerHTML   = dados.totalVal;

    }catch(erro){
        console.log("Erro na consulta dos dados", erro);
    }
}

function configurarAcoesTabela(){
    const tabela = document.getElementById("corpoTabela");

    tabela.addEventListener("click", (evento) => {
        const botao = evento.target.closest(".btnAcao");
        if (!botao) return;

        const codigo = botao.dataset.codigo;

        if (botao.classList.contains("btnEditar")) {
            editarProduto(codigo);
        } else if (botao.classList.contains("btnExcluir")) {
            excluirProduto(codigo);
        }
    });
}

function editarProduto(codigo){
    const produto = produtosCarregados.find(p => String(p.id) === String(codigo));
    if (!produto) return;

    // Preenche o formulário com os dados atuais do produto
    document.getElementById("editarId").value             = produto.id;
    document.getElementById("editarCodigoBarras").value   = produto.codigoBarras;
    document.getElementById("editarNome").value           = produto.nomeProduto;
    document.getElementById("editarFabricante").value     = produto.fabricante;
    document.getElementById("editarMarca").value          = produto.marca;
    document.getElementById("editarValor").value          = produto.valor;
    document.getElementById("editarLocal").value          = produto.localArmazenamento;
    document.getElementById("editarStatus").value         = produto.status;

    document.getElementById("modalEditar").showModal();
}

function configurarModalEditar(){
    const modal = document.getElementById("modalEditar");
    const form  = document.getElementById("formEditar");

    document.getElementById("btnCancelarEditar").addEventListener("click", () => modal.close());

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) modal.close();
    });

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const idProduto = document.getElementById("editarId").value;
        const produtoAtualizado = {
            codigoBarras:       document.getElementById("editarCodigoBarras").value,
            nomeProduto:        document.getElementById("editarNome").value,
            fabricante:         document.getElementById("editarFabricante").value,
            marca:              document.getElementById("editarMarca").value,
            valor:              document.getElementById("editarValor").value,
            localArmazenamento: document.getElementById("editarLocal").value,
            status:             document.getElementById("editarStatus").value
        };

        try{
            const response = await fetch(`http://localhost:8080/produtos/${idProduto}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(produtoAtualizado)
            });

            if (response.ok) {
                modal.close();
                carregarEstoque();
            } else {
                console.log("Não foi possível salvar as alterações", response.status);
            }
        }catch(erro){
            console.log("Erro ao salvar as alterações", erro);
        }
    });
}


function excluirProduto(codigo){
    const produto = produtosCarregados.find(p => String(p.id) === String(codigo));
    if (!produto) return;

    document.getElementById("excluirId").value = produto.id;
    document.getElementById("textoExcluir").innerHTML =
        `Tem certeza que deseja excluir <strong>${produto.nomeProduto}</strong>? Essa ação não pode ser desfeita.`;

    document.getElementById("modalExcluir").showModal();
}

function configurarModalExcluir(){
    const modal = document.getElementById("modalExcluir");


    document.getElementById("btnCancelarExcluir").addEventListener("click", () => {
        modal.close();
    });


    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            modal.close();
        }
    });


    document.getElementById("btnConfirmarExcluir").addEventListener("click", async (e) => {

        const botao = e.target;
        botao.disabled = true;
        botao.innerText = "Aguarde";

        try{
            const id = document.getElementById("excluirId").value;
            const response = await fetch(`http://localhost:8080/produtos/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                modal.close();
                carregarEstoque();

            } else {
                console.log("Não foi possível excluir o produto", response.status);
            }
        }catch(erro){
            console.log("Erro ao excluir o produto", erro);
        }finally {
            botao.disabled = false;
            botao.innerText = "Excluir";
        }
    });
}



window.onload = () => {
        carregarEstoque();
        carregarResumo();
        configurarAcoesTabela();
        configurarModalEditar();
        configurarModalExcluir();
};
