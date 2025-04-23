CREATE TABLE filmesAssistidos (
    perfil_id INT REFERENCES perfil(id),
    filme_id INT REFERENCES filme(id),
    PRIMARY KEY (perfil_id, filme_id)
);

CREATE TABLE filmesFavoritos (
    perfil_id INT REFERENCES perfil(id),
    filme_id INT REFERENCES filme(id),
    PRIMARY KEY (perfil_id, filme_id)
);

CREATE TABLE filmesWatchLater (
    perfil_id INT REFERENCES perfil(id),
    filme_id INT REFERENCES filme(id),
    PRIMARY KEY (perfil_id, filme_id)
);

CREATE TABLE filmesCriticas (
    perfil_id INT REFERENCES perfil(id),
    filme_id INT REFERENCES filme(id),
	nota INT NOT NULL,
	descricao TEXT,
    PRIMARY KEY (perfil_id, filme_id)
);

ALTER TABLE filmesCriticas
ADD CONSTRAINT check_nota_range CHECK (nota >= 0 AND nota <= 10);

