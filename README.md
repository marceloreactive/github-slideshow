# Cesta Certa - Inteligência de Compra para Supermercados

O "Cesta Certa" é um aplicativo móvel projetado para garantir que os consumidores brasileiros paguem o menor preço possível em suas compras de supermercado. A aplicação permite que os usuários criem listas de compras e, com um único toque, descubram a combinação ótima de supermercados para maximizar sua economia.

## Proposta de Valor

Nossa missão é devolver o poder de compra ao consumidor, oferecendo uma ferramenta inteligente que compara os preços da cesta de compras completa em diversos estabelecimentos, garantindo a máxima economia com o mínimo de esforço.

## Estrutura do Projeto

Este repositório está organizado da seguinte forma:

-   `/mobile_app`: Contém o código-fonte do aplicativo móvel, desenvolvido em React Native. Esta é a interface com a qual o usuário final interage.
-   `/backend`: Contém a API RESTful, desenvolvida em Python com o framework Flask. O backend é responsável por gerenciar usuários, listas de compras e executar o algoritmo de otimização.
-   `/scrapers`: Contém os robôs (web scrapers) responsáveis pela coleta de dados de preços dos sites dos supermercados.