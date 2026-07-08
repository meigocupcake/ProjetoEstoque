let produtosCarregados = [];

function dataHoje() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function debounce(func, delay) {
    let timeoutId;

    return function(...args) {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

function corLinha(val, base) {
    val = Number(val);
    base = Number(base);
    if (val < base)     return "fundoRepor";
    if (val <= base + 3) return "fundoAtencao";
    return "fundoPadrao";
}

function validarDatas(dataFabricacao, dataVencimento) {
    if (!dataFabricacao || !dataVencimento) {
        alert("Informe a data de fabricação e a data de vencimento.");
        return false;
    }
    if (dataFabricacao > dataHoje()) {
        alert("A data de fabricação não pode ser posterior à data de hoje.");
        return false;
    }
    if (dataVencimento < dataFabricacao) {
        alert("A data de vencimento não pode ser anterior à data de fabricação.");
        return false;
    }
    return true;
}

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
                   <tr class="${corLinha(item.quantidade, item.minimoEstoque)}">
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

    document.getElementById("editarId").value             = produto.id;
    document.getElementById("editarCodigoBarras").value   = produto.codigoBarras;
    document.getElementById("editarNome").value           = produto.nomeProduto;
    document.getElementById("editarFabricante").value     = produto.fabricante;
    document.getElementById("editarMarca").value          = produto.marca;
    document.getElementById("editarValor").value          = produto.valor;
    document.getElementById("editarLocal").value          = produto.localArmazenamento;
    document.getElementById("editarStatus").value         = produto.status;
    document.getElementById("editarEstoqueMinimo").value  = produto.minimoEstoque;
    document.getElementById("editarDataFabricacao").value = produto.dataFabricacao;
    document.getElementById("editarDataVencimento").value = produto.dataVencimento;

    document.getElementById("editarDataVencimento").min   = produto.dataFabricacao || "";

    document.getElementById("modalEditar").showModal();
}

function configurarModalEditar(){
    const modal = document.getElementById("modalEditar");
    const form  = document.getElementById("formEditar");

    document.getElementById("btnCancelarEditar").addEventListener("click", () => modal.close());

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) modal.close();
    });

    const dataFab = document.getElementById("editarDataFabricacao");
    const dataVen = document.getElementById("editarDataVencimento");
    dataFab.max = dataHoje();
    dataFab.addEventListener("change", () => { dataVen.min = dataFab.value; });

    const editarCodigoBarras = document.getElementById("editarCodigoBarras");
    editarCodigoBarras.addEventListener("input", () => {
        editarCodigoBarras.value = editarCodigoBarras.value.replace(/\D/g, '');
    });

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const dataFabricacao = dataFab.value;
        const dataVencimento = dataVen.value;

        if (!validarDatas(dataFabricacao, dataVencimento)) {
            return;
        }

        const idProduto = document.getElementById("editarId").value;
        const produtoAtualizado = {
            codigoBarras:       document.getElementById("editarCodigoBarras").value,
            nomeProduto:        document.getElementById("editarNome").value,
            fabricante:         document.getElementById("editarFabricante").value,
            marca:              document.getElementById("editarMarca").value,
            valor:              document.getElementById("editarValor").value,
            localArmazenamento: document.getElementById("editarLocal").value,
            status:             document.getElementById("editarStatus").value,
            minimoEstoque:      Number(document.getElementById("editarEstoqueMinimo").value),
            dataFabricacao:     dataFabricacao,
            dataVencimento:     dataVencimento
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
                carregarHistorico();
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
                carregarHistorico();

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

async function carregarHistorico(){
    const corpoHistorico = document.getElementById("corpoHistorico");
    const response = await fetch("http://localhost:8080/operacoes");
    const dados = await response.json();

    corpoHistorico.innerHTML="";

    dados.forEach(item =>{
        const linha = `
                   <tr>
                        <td>${item.codigoBarras}</td>
                       <td>${item.nomeProduto}</td>
                       <td>${item.operacao}</td>
                       <td>${item.quantidade}</td>
                       <td>${item.dataOperacao}</td>
                   </tr>
                   `;
        corpoHistorico.innerHTML += linha;
    });
}


async function configurarHistorico(){
    const botao           = document.getElementById("btnAuditoria");
    const tabelaProdutos  = document.getElementById("tabelaProdutos");
    const tabelaHistorico = document.getElementById("tabelaHistorico");

    const busca           = document.querySelector(".busca");

    botao.addEventListener("click", () => {
        const mostrandoHistorico = botao.classList.toggle("ativo");

        if (mostrandoHistorico) {
            botao.textContent = "Dashboard";
            tabelaProdutos.hidden  = true;
            tabelaHistorico.hidden = false;
            if (busca) busca.hidden = true;
            carregarEstoque();
        } else {
            botao.textContent = "Histórico";
            tabelaProdutos.hidden  = false;
            tabelaHistorico.hidden = true;
            if (busca) busca.hidden = false;
            carregarHistorico();
        }
    });
}

const pesquisa = async (valorInput) => {
    const response = await fetch(`http://localhost:8080/produtos?busca=${valorInput}`)
    const dados = await response.json()
    const tabela = document.getElementById("corpoTabela");
    tabela.innerHTML = "";

    dados.forEach(item =>{
        const linha = `
                   <tr class="${corLinha(item.quantidade, item.minimoEstoque)}">
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
        tabela.innerHTML += linha;
    });
}

const pesquisaDebounced = debounce(pesquisa, 200);

const input = document.getElementById("pesquisa");
input.addEventListener("change", async (e) => {
    const valorInput = e.target.value;
    pesquisaDebounced(valorInput);
});


window.onload = () => {
    carregarEstoque();
    carregarHistorico();
    configurarAcoesTabela();
    configurarModalEditar();
    configurarModalExcluir();
    configurarHistorico();
};
