\connect thyme_database

CREATE SCHEMA private;
CREATE SCHEMA peepee;

ALTER SCHEMA private OWNER TO anthony;
ALTER SCHEMA peepee OWNER TO anthony;

CREATE TABLE public.items (
    id SERIAL PRIMARY KEY,
    title text,
    category text,
    price text,
    start_date date,
    end_date date,
    store_id integer
);

COMMENT ON TABLE public.items IS
'Items on sale in the grocery store';

CREATE TABLE public.recipes (
    id SERIAL PRIMARY KEY,
    info json NOT NULL,
    postal_code text NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.recipes IS
'Recipes that can be created based on the postal code';

CREATE TABLE public.stores (
    id SERIAL PRIMARY KEY,
    company_name text NOT NULL,
    name text NOT NULL,
    street_name text NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    postal_code text NOT NULL
);

COMMENT ON TABLE public.stores IS
'Grocery Store Info';


