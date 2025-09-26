document.addEventListener('DOMContentLoaded', function() {

    // Simula a geração do cardápio na página inicial
    const generatorForm = document.getElementById('generator-form');

    if (generatorForm) {
        generatorForm.addEventListener('submit', function(event) {
            // Previne o envio real do formulário, que recarregaria a página
            event.preventDefault();

            // Redireciona o usuário para a página de resultados estática
            // Em uma aplicação real, aqui você enviaria os dados para o backend
            window.location.href = 'resultados.html';
        });
    }

    // Nota: O botão "Gerar Lista de Compras" em resultados.html
    // e os links de receita já funcionam com <a> tags, então não precisam de JS adicional
    // para esta simulação estática.

});