-- Semana 09 — Hyperdrive: Seed de datos de prueba (25 productos)
-- Ejecutar después de schema.sql
-- psql "postgresql://user:pass@host/dbname" -f seed.sql

INSERT INTO products (name, description, price, stock, active) VALUES
  ('Laptop Pro 15"',             'Laptop de alto rendimiento con pantalla 4K',              1299.99,  8, true),
  ('Mouse Inalámbrico Ergonómico','Mouse vertical para reducir fatiga en muñeca',              49.99, 45, true),
  ('Teclado Mecánico TKL',       'Teclado compacto con switches Cherry MX Blue',              89.99, 23, true),
  ('Monitor 27" 4K',             'Panel IPS con tecnología HDR400',                          399.99, 12, true),
  ('Auriculares Bluetooth ANC',  'Cancelación activa de ruido, 30h de batería',              149.99, 31, true),
  ('Webcam HD 1080p',            'Cámara con micrófono integrado y autofocus',                79.99, 55, true),
  ('Hub USB-C 7 en 1',          'Compatible con Thunderbolt 4, carga 100W PD',               59.99, 67, true),
  ('SSD NVMe 1TB',               'Velocidad de lectura hasta 3500 MB/s',                      89.99, 19, true),
  ('RAM DDR5 32GB',              'Kit 2x16GB a 6000MHz para workstation',                    119.99, 14, true),
  ('Tarjeta Gráfica RTX 4070',   '12GB GDDR6X, compatible con DLSS 3.0',                    649.99,  5, true),
  ('Fuente de Poder 750W',       'Certificación 80+ Gold, totalmente modular',                89.99, 22, true),
  ('Disco Duro NAS 4TB',         'Optimizado para NAS, rotación a 7200 RPM',                  79.99, 38, true),
  ('Router Wi-Fi 6E',            'Tri-band, cobertura hasta 300m², listo para mesh',         199.99, 17, true),
  ('Switch de Red 8 Puertos',    'Gigabit no gestionado, plug and play',                      29.99, 43, true),
  ('UPS 1200VA',                 'Protección ante apagones con AVR automático',              129.99,  9, true),
  ('Impresora Láser Color',      'Impresión a doble cara automática y Wi-Fi',                299.99,  7, true),
  ('Escáner Documental A4',      'Alimentador automático de 50 hojas, USB 3.0',             179.99, 11, true),
  ('Proyector Full HD',          '3500 lúmenes, HDMI, USB, corrección trapezoidal',          399.99,  4, true),
  ('Tablet 11"',                 '256GB de almacenamiento, 5G, stylus incluido',             549.99, 16, true),
  ('Smartphone Flagship',        '12GB RAM, cámara 200MP, batería de 5000mAh',               899.99, 20, true),
  ('Smartwatch GPS',             'Monitoreo cardíaco continuo, SpO2, resistente al agua',    249.99, 28, true),
  ('Cable HDMI 2.1 2m',         'Soporte para 8K a 60Hz, certificado oficial',               19.99,120, true),
  ('Soporte Monitor Doble',      'Brazo articulado, carga de hasta 15kg por monitor',         79.99, 33, true),
  ('Alfombrilla Gaming XXL',     'Base de tela, 90x40cm, superficie para teclado y mouse',   24.99, 89, true),
  ('Cámara de Seguridad IP 4K',  'PoE, visión nocturna 30m, resistente IP67',                89.99, 41, true);
