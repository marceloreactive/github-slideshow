import requests
from bs4 import BeautifulSoup
import json

def scrape_pao_de_acucar():
    # URL de exemplo: busca por "arroz" no Pão de Açúcar
    URL = "https://www.paodeacucar.com/busca?q=arroz"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    products = []

    try:
        print("Tentando fazer a coleta de dados ao vivo no Pão de Açúcar...")
        response = requests.get(URL, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'lxml')

        # Tentativa de encontrar os cards de produtos. A classe 'showcase-item-v2' é um exemplo.
        for card in soup.find_all('div', class_='showcase-item-v2'):
            name_tag = card.find('p', class_='product-card-name')
            price_tag = card.find('p', class_='product-card-price')

            if name_tag and price_tag:
                name = name_tag.get_text(strip=True)
                price = price_tag.get_text(strip=True)

                products.append({
                    "product_name": name,
                    "price": price,
                    "supermarket": "Pão de Açúcar"
                })
        if products:
             print(f"{len(products)} produtos encontrados no site.")

    except requests.exceptions.RequestException as e:
        print(f"Erro ao acessar a URL: {e}")
        # A coleta de dados ao vivo falhou, mas o script continuará para a lógica de fallback.

    # Se a coleta de dados ao vivo falhar ou não encontrar produtos, a lista 'products' estará vazia.
    # Nesse caso, usamos dados de exemplo para o MVP.
    if not products:
        print("Coleta de dados ao vivo falhou ou não retornou produtos.")
        print("Criando um arquivo JSON de exemplo com dados fictícios para o MVP.")
        products = [
            {"product_name": "Arroz Agulhinha Tipo 1 Camil 5kg", "price": "R$ 25,90", "supermarket": "Pão de Açúcar (Exemplo)"},
            {"product_name": "Arroz Integral Orgânico Mãe Terra 1kg", "price": "R$ 12,50", "supermarket": "Pão de Açúcar (Exemplo)"},
            {"product_name": "Feijão Carioca Tipo 1 Camil 1kg", "price": "R$ 8,79", "supermarket": "Pão de Açúcar (Exemplo)"},
            {"product_name": "Azeite Extra Virgem Gallo 500ml", "price": "R$ 35,99", "supermarket": "Pão de Açúcar (Exemplo)"}
        ]

    # Salva os dados em um arquivo JSON na raiz do projeto
    with open('products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=4)

    print(f"Scraper finalizado. {len(products)} produtos foram salvos em 'products.json'.")

if __name__ == '__main__':
    scrape_pao_de_acucar()