# App de Atualização de Cronogramas do MS Project

Este projeto é uma aplicação web desenvolvida para permitir a atualização remota de cronogramas do Microsoft Project. Ele foi projetado para facilitar a comunicação entre a equipe de planejamento e a equipe de campo em projetos de construção.

## Fluxo de Trabalho

1.  **Importação:** O cronograma de uma obra, criado no MS Project, é exportado como um arquivo XML e importado para esta aplicação.
2.  **Atualização em Campo:** A equipe de campo acessa o cronograma da obra através de uma interface web, onde podem atualizar o percentual de conclusão de cada tarefa, adicionar comentários e anexar fotos.
3.  **Exportação:** As atualizações de progresso são consolidadas e podem ser exportadas em um formato compatível (XML ou CSV).
4.  **Sincronização:** O planejador importa o arquivo de atualização de volta para o MS Project para sincronizar o cronograma com os dados mais recentes do campo.

## Estrutura do Projeto

*   `/frontend`: Contém a aplicação de frontend (React) com a qual os usuários interagem.
*   `app.py`: A API de backend (Python/Flask) que gerencia os dados do projeto, a lógica de negócio e o processamento de arquivos.
*   `requirements.txt`: As dependências do backend Python.