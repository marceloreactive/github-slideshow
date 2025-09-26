from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

# Banco de dados em memória para o MVP
# Estrutura: { "list_id": {"name": "Minha Lista", "items": [{"name": "Arroz"}, {"name": "Feijão"}]} }
lists_db = {}

@app.route('/')
def index():
    return "API do Cesta Certa está no ar!"

# Endpoint para criar uma nova lista de compras
@app.route('/lists', methods=['POST'])
def create_list():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "O nome da lista é obrigatório."}), 400

    list_id = str(uuid.uuid4())
    lists_db[list_id] = {
        "name": data['name'],
        "items": data.get('items', [])
    }

    response = {"id": list_id, **lists_db[list_id]}
    return jsonify(response), 201

# Endpoint para obter todas as listas
@app.route('/lists', methods=['GET'])
def get_all_lists():
    return jsonify([{"id": id, **data} for id, data in lists_db.items()])

# Endpoint para obter uma lista específica
@app.route('/lists/<string:list_id>', methods=['GET'])
def get_list(list_id):
    if list_id not in lists_db:
        return jsonify({"error": "Lista não encontrada."}), 404
    return jsonify({"id": list_id, **lists_db[list_id]})

# Endpoint para atualizar uma lista (adicionar/remover itens)
@app.route('/lists/<string:list_id>', methods=['PUT'])
def update_list(list_id):
    if list_id not in lists_db:
        return jsonify({"error": "Lista não encontrada."}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Nenhum dado fornecido para atualização."}), 400

    # Atualiza o nome da lista, se fornecido
    if 'name' in data:
        lists_db[list_id]['name'] = data['name']

    # Substitui os itens da lista, se fornecidos
    if 'items' in data:
        lists_db[list_id]['items'] = data['items']

    return jsonify({"id": list_id, **lists_db[list_id]})

# Endpoint para deletar uma lista
@app.route('/lists/<string:list_id>', methods=['DELETE'])
def delete_list(list_id):
    if list_id not in lists_db:
        return jsonify({"error": "Lista não encontrada."}), 404

    del lists_db[list_id]
    return '', 204 # Resposta vazia com sucesso

if __name__ == '__main__':
    app.run(debug=True, port=5001) # Usando a porta 5001 para evitar conflitos