import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from lxml import etree
import io
import csv

app = Flask(__name__)
CORS(app)  # Habilita o CORS para permitir requisições do frontend

# Armazenamento em memória para as atualizações do projeto (solução simples)
project_updates = []

# Define a pasta para uploads temporários
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return "Backend em Python/Flask para o App de Cronogramas está no ar!"

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'projectFile' not in request.files:
        return jsonify({"error": "Nenhum arquivo foi enviado."}), 400

    file = request.files['projectFile']

    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado."}), 400

    if file and file.filename.endswith('.xml'):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        try:
            # Processa o arquivo XML com lxml
            tree = etree.parse(filepath)

            # Processa o arquivo XML com lxml para extrair as tarefas
            tree = etree.parse(filepath)
            root = tree.getroot()

            # O namespace é importante para encontrar os elementos corretamente
            # Geralmente, os arquivos do MS Project têm um namespace.
            # Vamos tentar encontrá-lo dinamicamente.
            namespace = ''
            if '}' in root.tag:
                namespace = root.tag.split('}')[0][1:] # Extrai o namespace da tag raiz

            # Define o namespace para as buscas XPath
            ns = {'ns': namespace} if namespace else None

            tasks = []
            # Encontra todas as tarefas no XML
            for task in root.xpath('//ns:Task', namespaces=ns):
                task_name = task.findtext('ns:Name', default='Nome não encontrado', namespaces=ns)
                task_uid = task.findtext('ns:UID', default='UID não encontrado', namespaces=ns)
                tasks.append({'uid': task_uid, 'name': task_name})

            # Remove o arquivo temporário
            os.remove(filepath)

            # Retorna a lista de tarefas encontradas
            return jsonify({"message": "Arquivo XML processado com sucesso.", "tasks": tasks}), 200

        except etree.XMLSyntaxError:
            # Remove o arquivo temporário em caso de erro
            os.remove(filepath)
            return jsonify({"error": "Erro ao processar o arquivo XML. Verifique o formato."}), 500
        except Exception as e:
            # Remove o arquivo temporário em caso de erro
            os.remove(filepath)
            return jsonify({"error": f"Ocorreu um erro inesperado: {str(e)}"}), 500

    return jsonify({"error": "Formato de arquivo inválido. Apenas .xml é permitido."}), 400

@app.route('/api/update', methods=['POST'])
def update_tasks():
    global project_updates
    data = request.get_json()
    if not data or 'tasks' not in data:
        return jsonify({"error": "Nenhum dado de tarefa recebido."}), 400

    # Armazena as atualizações na variável global
    project_updates = data['tasks']

    print("Atualizações de tarefas armazenadas:")
    for task in project_updates:
        print(f"  - ID: {task.get('uid')}, Progresso: {task.get('percentComplete')}%, Comentários: {task.get('comments')}")

    return jsonify({"message": "Atualizações recebidas e armazenadas com sucesso pelo servidor."}), 200

@app.route('/api/export', methods=['GET'])
def export_updates():
    global project_updates
    if not project_updates:
        return jsonify({"error": "Nenhum dado de atualização para exportar."}), 404

    # Cria um arquivo CSV em memória
    output = io.StringIO()
    writer = csv.writer(output)

    # Escreve o cabeçalho
    writer.writerow(['UID', 'Name', 'PercentComplete', 'Comments'])

    # Escreve os dados das tarefas
    for task in project_updates:
        writer.writerow([
            task.get('uid', ''),
            task.get('name', ''),
            task.get('percentComplete', ''),
            task.get('comments', '')
        ])

    # Retorna o CSV como uma resposta para download
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=project_updates.csv"}
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)