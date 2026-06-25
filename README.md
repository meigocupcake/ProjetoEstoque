TO-DO

Feature List

- Cadastro de produtos;
    - CadastroProduto Controller
    - POST Criar Produto - OK
    - GET Recuperar produto por id - OK
    - PUT Editar produto
      - recuperar o produto por ID;
      - alterar o produto 
      - salvar o produto subscrevendo o anterior OK
  - DELETE Excluir Produto
- Visualização de todos os produtos cadastrados;
    - GET todos os produtos OK
- Controle de entrada de produtos;
    - Tabela que relaciona produtos a quantidades e ações
      Ex: Entrou 10 canetas
- Controle de saída de produtos;
    - Mesma tabela de produtos a quantidades e ações
      Ex: Saiu 10 canetas
- Exibição da quantidade total disponível em estoque;
    - Tira a média da tabela de produtos por quantidades e ações.
- Identificação da prateleira ou local de armazenamento de cada produto;
    - Campo novo na model do produto
- Indicação da necessidade de reposição de estoque;
    - Tira a média da tabela de produtos e caso o produto esteja com poucas unidades, sinalizar baixo estoque
- Sinalização de quando é necessário emitir uma solicitação ou nota de compra para reposição dos produtos.

- Na model de produtos adicionar campo "local_armazenamento"

EXTRAS:
- Registrar perdas (vencidos)
- Não deixa registrar datas vencidas