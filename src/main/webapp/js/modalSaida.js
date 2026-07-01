
const modalSaida = document.getElementById('modalSaida');
const btnAbrirSaida = document.getElementById('btnSaida');
const btnCancelarSaida = document.getElementById('btnCancelarSaida');
const formSaida = document.getElementById('formSaida');


const produtoSaida = document.getElementById('produtoSaida');
const quantidadeSaida = document.getElementById('quantidadeSaida');
const loteSaida = document.getElementById('loteSaida');



btnAbrirSaida.addEventListener('click', () => {
    modalSaida.showModal();
});



btnCancelarSaida.addEventListener('click', () => {
    fecharModalSaida();
});



modalSaida.addEventListener('click', (evento) => {

    if (evento.target === modalSaida) {
        fecharModalSaida();
    }
});



formSaida.addEventListener('submit', (evento) => {

    evento.preventDefault();


    const dadosSaida = {
        produtoId: produtoSaida.value,
        quantidade: parseInt(quantidadeSaida.value, 10),
        lote: loteSaida.value.trim()
    };


    if (!validarSaida(dadosSaida)) {
        return;
    }



    console.log('Saída registrada:', dadosSaida);




    fecharModalSaida();




    if (typeof carregarEstoque === "function") {
        carregarEstoque();
    }
});



function fecharModalSaida() {
    formSaida.reset();
    modalSaida.close();
}



function validarSaida(dados) {
    if (!dados.produtoId) {
        alert('Selecione um produto.');
        return false;
    }

    if (isNaN(dados.quantidade) || dados.quantidade <= 0) {
        alert('A quantidade deve ser maior que zero.');
        return false;
    }

    if (dados.lote === '') {
        alert('Informe o lote do produto.');
        return false;
    }

    return true;
}






