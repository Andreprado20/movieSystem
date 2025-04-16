CREATE OR REPLACE FUNCTION get_movies_in_list(table_name text, profile_id integer)
RETURNS SETOF json AS $$
DECLARE
    query text;
BEGIN
    -- Build dynamic query based on table name
    query := format('
        SELECT f.* 
        FROM "Filme" f 
        INNER JOIN "%s" ml ON f.id = ml.filme_id 
        WHERE ml.perfil_id = %L
    ', table_name, profile_id);
    
    RETURN QUERY EXECUTE query;
END;
$$ LANGUAGE plpgsql; 