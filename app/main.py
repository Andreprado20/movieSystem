import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# === CONFIGURAÇÕES ===
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# Inicializa Supabase e Gemini
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
modelo = genai.GenerativeModel(model_name="models/gemini-2.0-flash")

# === FastAPI App ===
app = FastAPI()

# === Modelo de entrada da API ===
class FilmeID(BaseModel):
    filme_id: int

# === Função para resumir avaliações ===
def resumir_avaliacoes_com_gemini(filme_id: int, avaliacoes: list) -> str:
    if avaliacoes:
        avaliacoes_str = "\n".join([
            f"- Nota: {a['nota']:.1f}, Curtidas: {a['curtidas']}, Comentário: {a['comentario']}" for a in avaliacoes
        ])
        media = sum([a['nota'] for a in avaliacoes]) / len(avaliacoes)
    else:
        avaliacoes_str = "(nenhuma avaliação encontrada para este filme)"
        media = 0.0

    prompt = f"""
O ID do filme informado foi: {filme_id}

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

@app.get("/")
async def root():
    return {"message": "IA-comentarios Service is running"}

# === Rota principal da API ===
@app.post("/resumo")
def gerar_resumo_filme(payload: FilmeID):
    filme_id = payload.filme_id

    try:
        supabase.table("Avaliacao").select("*").limit(1).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao conectar com o banco de dados: {e}")

    avaliacoes = supabase.table("Avaliacao").select("*").eq("filme_id", filme_id).execute().data
    resposta = resumir_avaliacoes_com_gemini(filme_id, avaliacoes)
    return {"resumo": resposta}