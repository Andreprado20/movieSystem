from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from supabase import create_client, Client
import os

# Configurações via variáveis de ambiente
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Inicialização
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
modelo = genai.GenerativeModel(model_name="models/gemini-2.0-flash")

app = FastAPI()

class Pergunta(BaseModel):
    pergunta: str

def recomendar_com_gemini(pergunta_usuario, filmes):
    if filmes:
        filmes_str = "\n".join([
            f"- {f['titulo']} ({f['avaliacaoMedia']:.1f})\n  Diretor: {f.get('diretor', 'Desconhecido')}\n  Elenco: {', '.join(f.get('elenco', []))}\n  Gênero: {', '.join(f.get('genero', []))}\n  Sinopse: {f.get('sinopse', 'Sem sinopse disponível')}" for f in filmes
        ])
    else:
        filmes_str = "(nenhum filme encontrado com base na consulta)"

    prompt = f"""
O usuário perguntou: "{pergunta_usuario}"

Filmes disponíveis no banco de dados:

{filmes_str}

Sua tarefa é responder à pergunta do usuário de forma inteligente e relevante, com base na lista de filmes acima. Use todas as informações fornecidas.

Seja muito divertido!! Para que o usuário fique feliz.
"""

    resposta = modelo.generate_content(prompt)
    return resposta.text

@app.post("/responder")
async def responder(pergunta: Pergunta):
    try:
        supabase.table("Filme").select("*").limit(1).execute()
    except Exception as e:
        return {"resposta": modelo.generate_content(f"Erro ao conectar com o banco de dados: {e}. Informe isso ao usuário de forma gentil.").text}

    filmes = supabase.table("Filme").select("*").order("avaliacaoMedia", desc=True).limit(200).execute().data
    resposta = recomendar_com_gemini(pergunta.pergunta, filmes)
    return {"resposta": resposta}
