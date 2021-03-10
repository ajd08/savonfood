CREATE TABLE savonfood_public.stores (
  id serial PRIMARY KEY,
  company_name text NOT NULL,
  name text NOT NULL,
  street_name text NOT NULL,
  city text NOT NULL,
  province text NOT NULL, 
  postal_code text NOT NULL
);


CREATE TABLE savonfood_public.items (
  id serial PRIMARY KEY,
  title text,
  category text,
  price text,
  start_date date,
  end_date date,
  store_id int,
  FOREIGN KEY(store_id)
  REFERENCES savonfood_public.stores(id) 
  ON DELETE CASCADE
);


