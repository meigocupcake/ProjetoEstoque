let produtos = [];
let termoBusca = "";
let visaoAtual = mostrarAbaixo;

function dataHoje() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
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

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const ehAtivo   = (p) => String(p.status).toLowerCase() === "ativo";
const ehInativo = (p) => String(p.status).toLowerCase() === "inativo";

function setBotaoAtivo(id){
    ["btnAbaixo", "btnProximo", "btnTodos"].forEach(b => {
        document.getElementById(b).classList.toggle("ativo", b === id);
    });
}

function setTema(classe){
    const t = document.getElementById("tabelaProdutos");
    t.classList.remove("temaAmarelo", "temaAzul");
    if (classe) t.classList.add(classe);
}

function ajustarCabecalhoAcoes(comAcoes){
    const tr = document.querySelector("#tabelaProdutos thead tr");
    let th = document.getElementById("thAcoes");
    if (comAcoes && !th) {
        th = document.createElement("th");
        th.id = "thAcoes";
        th.textContent = "Ações";
        tr.appendChild(th);
    } else if (!comAcoes && th) {
        th.remove();
    }
}

function aplicarBusca(lista){
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter(p =>
        String(p.nomeProduto).toLowerCase().includes(termo) ||
        String(p.codigoBarras).toLowerCase().includes(termo) ||
        String(p.marca).toLowerCase().includes(termo) ||
        String(p.fabricante).toLowerCase().includes(termo)
    );
}

function renderizar(lista, mensagemVazia, comAcoes){
    ajustarCabecalhoAcoes(comAcoes);

    const tabela = document.getElementById("corpoTabela");
    tabela.innerHTML = "";

    const colspan = comAcoes ? 12 : 11;

    if (lista.length === 0) {
        tabela.innerHTML =
            `<tr class="linhaVazia"><td colspan="${colspan}">${mensagemVazia}</td></tr>`;
        return;
    }

    lista.forEach(item =>{
        const reativarBtn = (comAcoes && ehInativo(item))
            ? `<button type="button" class="btnAcao btnReativar" title="Reativar" data-codigo="${item.id}">
                               <img src="../img/reativar.png" alt="Reativar" />
                           </button>`
            : "";

        const acoes = comAcoes ? `
                       <td class="acoesTabela">
                           <button type="button" class="btnAcao btnEditar" title="Editar" data-codigo="${item.id}">
                               <img src="../img/editar.png" alt="Editar" />
                           </button>
                           ${reativarBtn}
                           <button type="button" class="btnAcao btnExcluir" title="Excluir" data-codigo="${item.id}">
                               <img src="../img/excluir.png" alt="Excluir" />
                           </button>
                       </td>` : "";

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
                       <td>${item.dataFabricacao}</td>
                       <td>${item.dataVencimento}</td>
                       ${acoes}
                   </tr>
                   `;
        tabela.innerHTML += linha;
    });
}

function mostrarAbaixo(){
    visaoAtual = mostrarAbaixo;
    setBotaoAtivo("btnAbaixo");
    setTema(null);

    const lista = produtos.filter(p =>
        ehAtivo(p) && Number(p.quantidade) < Number(p.minimoEstoque)
    );
    renderizar(aplicarBusca(lista), "Nenhum produto abaixo do estoque mínimo.", false);
}

function mostrarProximos(){
    visaoAtual = mostrarProximos;
    setBotaoAtivo("btnProximo");
    setTema("temaAmarelo");

    const lista = produtos.filter(p => {
        const q = Number(p.quantidade);
        const min = Number(p.minimoEstoque);
        return ehAtivo(p) && q >= min && q <= min + 3;
    });
    renderizar(aplicarBusca(lista), "Nenhum produto próximo do estoque mínimo.", false);
}

function mostrarInativos(){
    visaoAtual = mostrarInativos;
    setBotaoAtivo("btnTodos");
    setTema("temaAzul");

    const lista = produtos.filter(ehInativo);
    renderizar(aplicarBusca(lista), "Nenhum produto inativo.", true);
}

async function buscarProdutos(){
    const response = await fetch("http://localhost:8080/produtos");
    produtos = await response.json();
}

function configurarAcoesTabela(){
    const tabela = document.getElementById("corpoTabela");
    tabela.addEventListener("click", (evento) => {
        const botao = evento.target.closest(".btnAcao, .btnReativar");
        if (!botao) return;

        const codigo = botao.dataset.codigo;
        if (botao.classList.contains("btnEditar")) {
            editarProduto(codigo);
        } else if (botao.classList.contains("btnReativar")) {
            reativarProduto(codigo);
        } else if (botao.classList.contains("btnExcluir")) {
            excluirProduto(codigo);
        }
    });
}

function reativarProduto(codigo){
    const produto = produtos.find(p => String(p.id) === String(codigo));
    if (!produto) return;

    document.getElementById("reativarId").value = produto.id;
    document.getElementById("textoReativar").innerHTML =
        `Deseja reativar <strong>${produto.nomeProduto}</strong>?`;

    document.getElementById("modalReativar").showModal();
}

function configurarModalReativar(){
    const modal = document.getElementById("modalReativar");

    document.getElementById("btnCancelarReativar").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) modal.close();
    });

    document.getElementById("btnConfirmarReativar").addEventListener("click", async (e) => {
        const botao = e.target;
        botao.disabled = true;
        botao.innerText = "Aguarde";

        try{
            const id = document.getElementById("reativarId").value;
            const produto = produtos.find(p => String(p.id) === String(id));
            if (!produto) return;

            const atualizado = {
                codigoBarras:       produto.codigoBarras,
                nomeProduto:        produto.nomeProduto,
                fabricante:         produto.fabricante,
                marca:              produto.marca,
                valor:              produto.valor,
                localArmazenamento: produto.localArmazenamento,
                status:             "Ativo",
                minimoEstoque:      Number(produto.minimoEstoque),
                dataFabricacao:     produto.dataFabricacao,
                dataVencimento:     produto.dataVencimento
            };

            const response = await fetch(`http://localhost:8080/produtos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(atualizado)
            });

            if (response.ok) {
                alert('Produto reativado com sucesso.');
                modal.close();
                await buscarProdutos();
                visaoAtual();
            } else {
                console.log("Não foi possível reativar o produto", response.status);
            }
        }catch(erro){
            console.log("Erro ao reativar o produto", erro);
        }finally{
            botao.disabled = false;
            botao.innerText = "Reativar";
        }
    });
}

function editarProduto(codigo){
    const produto = produtos.find(p => String(p.id) === String(codigo));
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
        if (!validarDatas(dataFabricacao, dataVencimento)) return;

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
                await buscarProdutos();
                visaoAtual();
            } else {
                console.log("Não foi possível salvar as alterações", response.status);
            }
        }catch(erro){
            console.log("Erro ao salvar as alterações", erro);
        }
    });
}

function excluirProduto(codigo){
    const produto = produtos.find(p => String(p.id) === String(codigo));
    if (!produto) return;

    document.getElementById("excluirId").value = produto.id;
    document.getElementById("textoExcluir").innerHTML =
        `Tem certeza que deseja excluir <strong>${produto.nomeProduto}</strong>? Essa ação não pode ser desfeita.`;

    document.getElementById("modalExcluir").showModal();
}

function configurarModalExcluir(){
    const modal = document.getElementById("modalExcluir");

    document.getElementById("btnCancelarExcluir").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) modal.close();
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
                alert('Produto excluído com sucesso.')
                modal.close();
                await buscarProdutos();
                visaoAtual();
            } else {
                console.log("Não foi possível excluir o produto", response.status);
            }
        }catch(erro){
            console.log("Erro ao excluir o produto", erro);
        }finally{
            botao.disabled = false;
            botao.innerText = "Excluir";
        }
    });
}

window.onload = async () => {
    await buscarProdutos();
    mostrarAbaixo();

    document.getElementById("btnAbaixo").addEventListener("click", mostrarAbaixo);
    document.getElementById("btnProximo").addEventListener("click", mostrarProximos);
    document.getElementById("btnTodos").addEventListener("click", mostrarInativos);
    document.getElementById("pesquisa").addEventListener("input", debounce((e) => {
        termoBusca = e.target.value;
        visaoAtual();
    }, 200));

    configurarAcoesTabela();
    configurarModalEditar();
    configurarModalExcluir();
    configurarModalReativar();
};
