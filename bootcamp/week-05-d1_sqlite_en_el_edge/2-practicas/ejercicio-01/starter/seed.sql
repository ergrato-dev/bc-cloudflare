-- Seed data — 20 películas representativas
INSERT INTO movies (title, director, genre, year, rating) VALUES
  ('Blade Runner',               'Ridley Scott',         'sci-fi',    1982, 8.1),
  ('2001: A Space Odyssey',      'Stanley Kubrick',      'sci-fi',    1968, 8.3),
  ('Alien',                      'Ridley Scott',         'sci-fi',    1979, 8.4),
  ('The Matrix',                 'Wachowski Sisters',    'sci-fi',    1999, 8.7),
  ('Interstellar',               'Christopher Nolan',    'sci-fi',    2014, 8.6),
  ('Inception',                  'Christopher Nolan',    'thriller',  2010, 8.8),
  ('The Godfather',              'Francis Ford Coppola', 'crime',     1972, 9.2),
  ('Pulp Fiction',               'Quentin Tarantino',    'crime',     1994, 8.9),
  ('Schindler''s List',           'Steven Spielberg',     'drama',     1993, 9.0),
  ('The Shawshank Redemption',   'Frank Darabont',       'drama',     1994, 9.3),
  ('Fight Club',                 'David Fincher',        'thriller',  1999, 8.8),
  ('The Silence of the Lambs',   'Jonathan Demme',       'thriller',  1991, 8.6),
  ('Parasite',                   'Bong Joon-ho',         'thriller',  2019, 8.5),
  ('Pan''s Labyrinth',            'Guillermo del Toro',   'fantasy',   2006, 8.2),
  ('Spirited Away',              'Hayao Miyazaki',       'fantasy',   2001, 8.6),
  ('Princess Mononoke',          'Hayao Miyazaki',       'fantasy',   1997, 8.4),
  ('City of God',                'Fernando Meirelles',   'crime',     2002, 8.6),
  ('La La Land',                 'Damien Chazelle',      'drama',     2016, 8.0),
  ('Mad Max: Fury Road',         'George Miller',        'action',    2015, 8.1),
  ('Everything Everywhere',      'Daniels',              'sci-fi',    2022, 7.8);

UPDATE stats SET value = 20 WHERE key = 'count';
