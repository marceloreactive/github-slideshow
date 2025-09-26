import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]); // Novo estado para armazenar as tarefas

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
    setTasks([]); // Limpa as tarefas ao selecionar novo arquivo
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecione um arquivo primeiro.');
      return;
    }

    const formData = new FormData();
    formData.append('projectFile', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Sucesso: ${data.message}`);
        // Inicializa as tarefas com campos para atualização
        const initialTasks = data.tasks.map(task => ({ ...task, percentComplete: '', comments: '' }));
        setTasks(initialTasks);
      } else {
        setMessage(`Erro: ${data.error}`);
        setTasks([]);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setMessage('Erro de rede ao tentar se comunicar com o servidor.');
      setTasks([]);
    }
  };

  const handleTaskUpdate = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: tasks }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Sucesso: ${data.message}`);
      } else {
        setMessage(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      setMessage('Erro de rede ao tentar salvar as alterações.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>App de Atualização de Cronogramas</h1>
        <p>Importe um arquivo XML do MS Project para começar.</p>
      </header>
      <main className="App-main">
        <div className="upload-container">
          <input type="file" accept=".xml" onChange={handleFileChange} />
          <button onClick={handleUpload}>Fazer Upload</button>
        </div>
        {message && <p className="message">{message}</p>}

        {tasks.length > 0 && (
          <div className="tasks-container">
            <h2>Tarefas do Projeto</h2>
            <div className="tasks-list">
              {tasks.map((task, index) => (
                <div key={task.uid} className="task-item">
                  <div className="task-info">
                    <span><strong>ID:</strong> {task.uid}</span>
                    <span>{task.name}</span>
                  </div>
                  <div className="task-update-controls">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="progress-input"
                      placeholder="% Concluída"
                      value={task.percentComplete || ''}
                      onChange={(e) => handleTaskUpdate(index, 'percentComplete', e.target.value)}
                    />
                    <input
                      type="text"
                      className="comments-input"
                      placeholder="Adicionar comentário..."
                      value={task.comments || ''}
                      onChange={(e) => handleTaskUpdate(index, 'comments', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="action-buttons">
              <button className="save-button" onClick={handleSaveChanges}>Salvar Alterações</button>
              <a href="http://localhost:5000/api/export" className="export-button" download>Exportar para CSV</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;