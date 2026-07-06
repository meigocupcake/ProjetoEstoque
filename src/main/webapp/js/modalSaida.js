const modalSaida = document.getElementById('modalSaida');
const btnAbrirSaida = document.getElementById('btnSaida');
const btnCancelarSaida = document.getElementById('btnCancelarSaida');
const formSaida = document.getElementById('formSaida');

const produtoSaida = document.getElementById('produtoSaida');
const quantidadeSaida = document.getElementById('quantidadeSaida');


btnAbrirSaida.addEventListener('click', () => {
    modalSaida.showModal();
});


btnCancelarSaida.addEventListener('click', () => {
    fecharModalSaida();
});


// Fecha ao clicar fora da caixa
modalSaida.addEventListener('click', (evento) => {
    if (evento.target === modalSaida) {
        fecharModalSaida();
    }
});


formSaida.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const produtoId = produtoSaida.value;
    const quantidade = parseInt(quantidadeSaida.value, 10);

    if (!validarSaida(produtoId, quantidade)) {
        return;
    }

    try {
        const resposta = await fetch('http://localhost:8080/operacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    operacao: 'SAIDA',
                    quantidade,
                    idProduto: produtoId,
                    dataOperacao: new Date().toISOString().split("T")[0]
                }
            )
        });

        if (resposta.ok) {
            fecharModalSaida();
            if (typeof carregarEstoque === 'function') {
                carregarEstoque();
            }
            if (typeof carregarHistorico === 'function') {
                carregarHistorico();
            }
        } else if (resposta.status === 409) {
            alert('Estoque insuficiente para essa saída.');
        } else {
            alert('Não foi possível registrar a saída.');
        }
    } catch (erro) {
        console.error('Erro ao registrar saída:', erro);
        alert('Erro de conexão ao registrar a saída.');
    }
});


function fecharModalSaida() {
    formSaida.reset();
    modalSaida.close();
}


function validarSaida(produtoId, quantidade) {
    if (!produtoId) {
        alert('Selecione um produto.');
        return false;
    }
    if (isNaN(quantidade) || quantidade <= 0) {
        alert('A quantidade deve ser maior que zero.');
        return false;
    }
    return true;
}
