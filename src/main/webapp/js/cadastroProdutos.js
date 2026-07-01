const form = document.getElementById('formCadastroProduto');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dados = Object.fromEntries(new FormData(form).entries());

    dados.minimoEstoque = Number(dados.estoqueMinimo);
    delete dados.estoqueMinimo;

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
