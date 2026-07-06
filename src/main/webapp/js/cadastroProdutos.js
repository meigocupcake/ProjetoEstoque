const form = document.getElementById('formCadastroProduto');

const inputDataFabricacao = form.querySelector('[name="dataFabricacao"]');
const inputDataVencimento = form.querySelector('[name="dataVencimento"]');

const inputCodigoBarras = form.querySelector('[name="codigoBarras"]');
inputCodigoBarras.addEventListener('input', () => {
    inputCodigoBarras.value = inputCodigoBarras.value.replace(/\D/g, '');
});

function dataHoje() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

inputDataFabricacao.max = dataHoje();

inputDataFabricacao.addEventListener('change', () => {
    inputDataVencimento.min = inputDataFabricacao.value;
});

function validarDatas(dataFabricacao, dataVencimento) {
    if (!dataFabricacao || !dataVencimento) {
        alert('Informe a data de fabricação e a data de vencimento.');
        return false;
    }
    if (dataFabricacao > dataHoje()) {
        alert('A data de fabricação não pode ser posterior à data de hoje.');
        return false;
    }
    if (dataVencimento < dataFabricacao) {
        alert('A data de vencimento não pode ser anterior à data de fabricação.');
        return false;
    }
    return true;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dados = Object.fromEntries(new FormData(form).entries());

    if (!validarDatas(dados.dataFabricacao, dados.dataVencimento)) {
        return;
    }

    dados.minimoEstoque = Number(dados.estoqueMinimo);
    delete dados.estoqueMinimo;

    dados.quantidade = Number(dados.quantidade);

    try {
        const resposta = await fetch('http://localhost:8080/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok && resposta.url.includes('dashboard.html')) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Não foi possível salvar o produto. Verifique os dados e tente novamente.');
        }
    } catch (erro) {
        console.error('Erro ao salvar o produto:', erro);
        alert('Erro de conexão ao salvar o produto.');
    }
});
