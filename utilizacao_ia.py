import os
import re
import google.generativeai as genai
from supabase import create_client, Client

# === CONFIGURAÇÕES ===
SUPABASE_URL = "https://qoplwtzicemqpxytfzoj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGx3dHppY2VtcXB4eXRmem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjk2MjYsImV4cCI6MjA1ODk0NTYyNn0.wYRh1hFXsmJPhZgPWJ1kioTXwioMIW_W-S9OWfnkoII"
GEMINI_API_KEY = "AIzaSyCgvJ2IGtvMuAgLZOwJdwLkdiKpqCyJJ-M"

# Inicializa Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Inicializa Gemini 2.0 Flash
genai.configure(api_key=GEMINI_API_KEY)
modelo = genai.GenerativeModel(model_name="models/gemini-2.0-flash")




# === Usar Gemini para gerar resposta baseada nos dados ===
def recomendar_com_gemini(pergunta_usuario, filmes):
    if filmes:
        filmes_str = "\n".join([
        f"- {f['titulo']} ({f['avaliacaoMedia']:.1f})\n  Diretor: {f.get('diretor', 'Desconhecido')}\n  Elenco: {', '.join(f.get('elenco', []))}\n  Gênero: {', '.join(f.get('genero', []))}\n  Sinopse: {f.get('sinopse', 'Sem sinopse disponível')}" for f in filmes
    ])
    else:
        filmes_str = "(nenhum filme encontrado com base na consulta)"

    #print(filmes_str)
    prompt = f"""
O usuário perguntou: \"{pergunta_usuario}\"

Filmes disponíveis no banco de dados:

{filmes_str}

Sua tarefa é responder à pergunta do usuário de forma inteligente e relevante, com base na lista de filmes acima. Use todas as informações fornecidas em cada item (título, avaliação, diretor, elenco, gênero e sinopse) para entender o que o usuário deseja.

Interprete livremente a intenção do usuário. Por exemplo:
- Se ele mencionar um diretor ou ator, procure nos campos correspondentes.
- Se citar uma nota (ex: nota 5), leve em consideração a avaliação, mas caso a única opção seja um filme com nota baixa, retorne ele mesmo assim.
- Se sugerir temas (como \"cão policial\"), procure na sinopse mesmo que o tema não esteja no título ou gênero.

Recomende os filmes que mais se encaixam no que foi pedido. Seja natural, divertido e útil. Nunca invente filmes que não estão na lista.

Seja muito divertido!! Para que o usuário fique feliz.
"""

    resposta = modelo.generate_content(prompt)
    return resposta.text

# === Fluxo principal ===
def responder_pergunta_usuario(pergunta):
    try:
        supabase.table("Filme").select("*").limit(1).execute()
    except Exception as e:
        return modelo.generate_content(f"Erro ao conectar com o banco de dados: {e}. Informe isso ao usuário de forma gentil.").text

    filmes = supabase.table("Filme").select("*").order("avaliacaoMedia", desc=True).limit(200).execute().data
    return recomendar_com_gemini(pergunta, filmes)

# === Exemplo de uso ===
if __name__ == "__main__":
    pergunta = input("O que você gostaria de assistir?\n> ")
    resposta = responder_pergunta_usuario(pergunta)
    print("\nRecomendações da IA:\n")
    print(resposta)
