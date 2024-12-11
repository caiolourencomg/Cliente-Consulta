# Importa as bibliotecas necessárias
from flask import Flask, request, jsonify  # Flask para criar a aplicação web, request para lidar com dados recebidos e jsonify para retornar dados em formato JSON
import json  # Biblioteca para manipulação de arquivos JSON

# Cria uma instância da aplicação Flask
app = Flask(__name__)

# Função para carregar os dados dos clientes a partir de um arquivo JSON
def carregar_clientes():
    with open('data/clientes.json', 'r') as arquivo:  # Abre o arquivo 'clientes.json' no modo leitura
        return json.load(arquivo)  # Retorna o conteúdo do arquivo como um objeto Python (lista de clientes)

# Função para salvar os dados dos clientes de volta no arquivo JSON
def salvar_clientes(clientes):
    with open('data/clientes.json', 'w') as arquivo:  # Abre o arquivo 'clientes.json' no modo escrita
        json.dump(clientes, arquivo, indent=4)  # Salva a lista de clientes no arquivo com indentação de 4 espaços

# Rota para consultar um cliente pelo CPF (método GET)
@app.route('/consultar_cliente', methods=['GET'])
def consultar_cliente():
    cpf = request.args.get('cpf')  # Obtém o CPF passado como parâmetro na URL (ex: /consultar_cliente?cpf=123)
    clientes = carregar_clientes()  # Carrega a lista de clientes do arquivo JSON
    
    # Busca o cliente que possui o CPF fornecido
    cliente = next((c for c in clientes if c['cpf'] == cpf), None)
    
    if cliente:
        return jsonify(cliente)  # Se o cliente for encontrado, retorna os dados do cliente em formato JSON
    else:
        return jsonify({'erro': 'Cliente não encontrado'}), 404  # Se não encontrar, retorna um erro 404

# Rota para cadastrar um novo cliente (método POST)
@app.route('/cadastrar_cliente', methods=['POST'])
def cadastrar_cliente():
    novo_cliente = request.get_json()  # Obtém os dados do novo cliente enviados no corpo da requisição em formato JSON
    clientes = carregar_clientes()  # Carrega a lista de clientes do arquivo JSON

    # Verifica se o CPF do novo cliente já está cadastrado
    if any(c['cpf'] == novo_cliente['cpf'] for c in clientes):
        return jsonify({'erro': 'CPF já cadastrado'}), 400  # Se o CPF já existir, retorna um erro 400 (Bad Request)
    
    # Adiciona o novo cliente à lista
    clientes.append(novo_cliente)
    clientes.sort(key=lambda c: c['nome'])  # Ordena a lista de clientes pelo nome em ordem alfabética
    salvar_clientes(clientes)  # Salva a lista de clientes no arquivo JSON
    
    return jsonify({'mensagem': 'Cliente cadastrado com sucesso!'})  # Retorna uma mensagem de sucesso

# Inicia a aplicação Flask em modo debug
if __name__ == '__main__':
    app.run(debug=True)
