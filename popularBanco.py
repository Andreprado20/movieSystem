import requests
from supabase import create_client, Client

# === Configurações ===
SUPABASE_URL = "https://qoplwtzicemqpxytfzoj.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGx3dHppY2VtcXB4eXRmem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjk2MjYsImV4cCI6MjA1ODk0NTYyNn0.wYRh1hFXsmJPhZgPWJ1kioTXwioMIW_W-S9OWfnkoII"
TMDB_API_KEY = "4b14d4d486906993d68ff2eb78c12aff"
LANG = "pt-BR"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# === Função para buscar gêneros mapeados ===
def get_genre_map():
    url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_API_KEY}&language={LANG}"
    res = requests.get(url).json()
    return {genre["id"]: genre["name"] for genre in res["genres"]}

# === Função para buscar créditos (diretor e elenco) ===
def get_credits(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={TMDB_API_KEY}&language={LANG}"
    res = requests.get(url).json()
    diretor = "Unknown"
    elenco = []

    for pessoa in res.get("crew", []):
        if pessoa.get("job") == "Director":
            diretor = pessoa.get("name")
            break

    for ator in res.get("cast", [])[:3]:  # Pega os 3 primeiros atores
        elenco.append(ator.get("name"))

    return diretor, elenco

# === Começa a importar filmes populares ===
def importar_filmes_populares():
    genre_map = get_genre_map()

    url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}&language={LANG}&page=10"
    filmes = requests.get(url).json().get("results", [])

    for filme in filmes:
        id_tmdb = filme["id"]
        titulo = filme["title"]
        sinopse = filme["overview"]
        avaliacao = filme["vote_average"]
        genero_nomes = [genre_map.get(gid, "Desconhecido") for gid in filme["genre_ids"]]

        # Busca diretor e elenco
        diretor, elenco = get_credits(id_tmdb)

        # Insere no Supabase
        data = {
            "titulo": titulo,
            "sinopse": sinopse,
            "avaliacaoMedia": avaliacao,
            "genero": genero_nomes,
            "diretor": diretor,
            "elenco": elenco
        }

        print(f"Inserindo: {titulo}")
        supabase.table("Filme").insert(data).execute()

    print("Importação concluída com sucesso!")

if __name__ == "__main__":
    importar_filmes_populares()