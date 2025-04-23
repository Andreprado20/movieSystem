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

# === Usar Gemini para gerar resposta baseada nas avaliações ===
def resumir_avaliacoes_com_gemini(pergunta_usuario, avaliacoes):
    if avaliacoes:
        avaliacoes_str = "\n".join([
            f"- Nota: {a['nota']:.1f}, Curtidas: {a['curtidas']}, Comentário: {a['comentario']}" for a in avaliacoes
        ])
        media = sum([a['nota'] for a in avaliacoes]) / len(avaliacoes)
    else:
        avaliacoes_str = "(nenhuma avaliação encontrada para este filme)"
        media = 0.0

    prompt = f"""
O usuário perguntou: "{pergunta_usuario}"

Você recebeu as seguintes avaliações do banco de dados:

{avaliacoes_str}

Sua tarefa é gerar um resumo similar aos utilizados em e-commerces, considerando a média geral das notas ({media:.2f}/10) e o conteúdo dos comentários. Faça o seguinte:

Destaque logo no início a média das avaliações (ex: "O filme recebeu uma média de 4.56/10").

Escreva um parágrafo breve, explicando como os espectadores descreveram o filme (ex: "Usuários elogiaram..."; "Alguns mencionaram...").

Liste em formato de marcadores (bullet points) os pontos positivos e negativos mais mencionados nos comentários.

Importante:

Não invente informações que não estejam presentes nas avaliações.

Seja fiel ao conteúdo textual, mas escreva de forma natural e acessível.

Utilize linguagem clara, objetiva e respeitosa.
"""

    resposta = modelo.generate_content(prompt)
    return resposta.text

# === Fluxo principal ===
def responder_pergunta_usuario(pergunta):
    try:
        supabase.table("Avaliacao").select("*").limit(1).execute()
    except Exception as e:
        return modelo.generate_content(f"Erro ao conectar com o banco de dados: {e}. Informe isso ao usuário de forma gentil.").text

    # Extração de filme_id da pergunta (exemplo simples com regex)
    match = re.search(r"filme\s+(\d+)", pergunta, re.IGNORECASE)
    if not match:
        return "Por favor, especifique o ID do filme, por exemplo: 'quero o resumo do filme 68'"

    filme_id = int(match.group(1))

    avaliacoes = supabase.table("Avaliacao").select("*").eq("filme_id", filme_id).execute().data
    return resumir_avaliacoes_com_gemini(pergunta, avaliacoes)

# === Exemplo de uso ===
if __name__ == "__main__":
    pergunta = input("Qual filme você quer analisar? (ex: resumo do filme 68)\n> ")
    resposta = responder_pergunta_usuario(pergunta)
    print("\nResumo das opiniões:\n")
    print(resposta)
