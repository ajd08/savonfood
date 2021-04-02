\connect thyme_database

CREATE FUNCTION delete_all_items() RETURNS text AS $$
BEGIN
TRUNCATE public.items;
RETURN 'ALL ITEMS DELETED';
END; $$
LANGUAGE PLPGSQL;

CREATE FUNCTION refresh_all_keys() RETURNS text AS $$
BEGIN
UPDATE private.spoonacular_keys
SET used = false;
RETURN 'ALL KEYS USED';
END; $$
LANGUAGE PLPGSQL;
