// Função para consultar um cliente baseado no CPF fornecido
function consultarCliente() {
    // Obtém o valor do campo de CPF da consulta
    const cpf = document.getElementById('cpf-consulta').value;

    // Faz uma requisição para o servidor com o CPF como parâmetro
    fetch(`/consultar_cliente?cpf=${cpf}`)
        .then(resposta => resposta.json()) // Converte a resposta da requisição para formato JSON
        .then(dados => {
            // Obtém o elemento onde o resultado da consulta será exibido
            const resultado = document.getElementById('resultado-consulta');
            
            // Verifica se há um erro no retorno (cliente não encontrado)
            if (dados.erro) {
                resultado.innerHTML = "Cliente não encontrado."; // Exibe mensagem de erro
                resultado.style.color = 'red'; // Define a cor da mensagem como vermelha
            } else {
                // Exibe as informações do cliente caso encontrado
                resultado.innerHTML = `Nome: ${dados.nome}<br>Data de Nascimento: ${dados.nascimento}<br>E-mail: ${dados.email}`;
                resultado.style.color = 'green'; // Define a cor da mensagem como verde
            }
        })
        .catch(erro => console.error('Erro:', erro)); // Trata erros da requisição
}

// Adiciona um evento de envio ao formulário de cadastro
document.getElementById('form-cadastro').addEventListener('submit', function(evento) {
    evento.preventDefault(); // Impede o envio do formulário (comportamento padrão)

    // Obtém os valores dos campos do formulário
    const cpf = document.getElementById('cpf-cadastro').value;
    const nome = document.getElementById('nome-cadastro').value;
    const nascimento = document.getElementById('nascimento-cadastro').value;
    const email = document.getElementById('email-cadastro').value;

    // Cria um objeto cliente com os dados do formulário
    const cliente = { cpf, nome, nascimento, email };

    // Envia uma requisição POST para o servidor para cadastrar o cliente
    fetch('/cadastrar_cliente', {
        method: 'POST', // Método HTTP POST
        headers: {
            'Content-Type': 'application/json' // Define que o conteúdo enviado será em formato JSON
        },
        body: JSON.stringify(cliente) // Converte o objeto cliente para JSON
    })
    .then(resposta => resposta.json()) // Converte a resposta para formato JSON
    .then(dados => {
        // Obtém o elemento onde o resultado do cadastro será exibido
        const resultado = document.getElementById('resultado-cadastro');
        
        // Verifica se houve algum erro no cadastro
        if (dados.erro) {
            resultado.innerHTML = dados.erro; // Exibe o erro retornado pelo servidor
            resultado.style.color = 'red'; // Define a cor da mensagem como vermelha
        } else {
            resultado.innerHTML = 'Cliente cadastrado com sucesso!'; // Exibe mensagem de sucesso
            resultado.style.color = 'green'; // Define a cor da mensagem como verde
        }
    })
    .catch(erro => console.error('Erro:', erro)); // Trata erros da requisição
});
