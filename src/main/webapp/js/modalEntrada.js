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


form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;

    console.log('Dados salvos:', { produto, quantidade });


    form.reset();
    modal.close();




    if (typeof carregarEstoque === "function") {
        carregarEstoque();
    }
});