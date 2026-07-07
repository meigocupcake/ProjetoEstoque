const modal = document.getElementById('modalEntrada');
const abrir = document.getElementById('btnEntrada');
const cancelar = document.getElementById('btnCancelar');
const form = document.getElementById('formEntrada');


abrir.addEventListener('click', () => {
    modal.showModal();
});


cancelar.addEventListener('click', () => {
    modal.close();
});

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();


    const produtoId = document.getElementById('produtoEntrada').value;
    const quantidade = parseInt(document.getElementById('quantidade').value, 10);

    if (!produtoId) {
        alert('Selecione um produto.');
        return;
    }
    if (isNaN(quantidade) || quantidade <= 0) {
        alert('A quantidade deve ser maior que zero.');
        return;
    }

    try {
        const resposta = await fetch('http://localhost:8080/operacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
            {
                        operacao: 'ENTRADA',
                        quantidade,
                        idProduto: produtoId,
                        dataOperacao: new Date().toISOString().split("T")[0]
                }
            )
        });

        if (resposta.ok) {
            alert('Entrada registrada com sucesso.')
            form.reset();
            modal.close();
            if (typeof carregarEstoque === 'function') {
                carregarEstoque();
            }

            if (typeof carregarHistorico === 'function') {
                carregarHistorico();
            }
        } else {
            alert('Não foi possível registrar a entrada.');
        }
    } catch (erro) {
        console.error('Erro ao registrar entrada:', erro);
        alert('Erro de conexão ao registrar a entrada.');
    }
});
