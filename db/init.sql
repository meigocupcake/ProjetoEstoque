USE estoque_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    username VARCHAR(50) NOT NULL,
    psw VARCHAR(255) NOT NULL,
    
    nameFirst VARCHAR(100),
    sobrenome VARCHAR(100),
    
    matricula VARCHAR(50),
    cpf VARCHAR(14),
    
    sexo VARCHAR(10),
    dtaNascimento DATE,
    
    email VARCHAR(150),
    telefone VARCHAR(20),
    
    funcao VARCHAR(100),
    
    cep VARCHAR(10),
    endereco VARCHAR(150),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(50),
    complemento VARCHAR(150),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (
    username, psw, nameFirst, sobrenome, matricula, cpf,
    sexo, dtaNascimento, email, telefone, funcao,
    cep, endereco, numero, bairro, cidade, estado, complemento
) VALUES (
    'admin', '1234', 'Admin', 'Sistema', '0001', '000.000.000-00',
    'Masculino', '1990-01-01', 'admin@email.com', '71999999999', 'Administrador',
    '40000-000', 'Rua Exemplo', '123', 'Centro', 'Salvador', 'BA', 'N/A'
);

CREATE TABLE produtos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(100) NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    fabricante VARCHAR(255),
    marca VARCHAR(255),
    data_fabricacao DATE,
    data_vencimento DATE,
    quantidade BIGINT,
    valor DECIMAL (10,2),
    total DECIMAL (10,2),
    satus VARCHAR(255)
    total DECIMAL (10,2)
);

