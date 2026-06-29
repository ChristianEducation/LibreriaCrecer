ALTER TABLE "about_sections"
ADD COLUMN "section_type" text NOT NULL DEFAULT 'story',
ADD COLUMN "icon" text,
ADD COLUMN "link_url" text,
ADD COLUMN "link_label" text;

-- Las filas existentes quedan como 'story' por el default. Correcto.

-- Pre-cargar las 4 tarjetas de oferta de la clienta:
INSERT INTO "about_sections"
  ("title", "content", "section_type", "icon", "display_order", "is_active")
VALUES
  ('Selección de libros',
   'Material pastoral, recursos catequéticos y artículos religiosos para acompañar el crecimiento personal, familiar y comunitario.',
   'offering', 'books', 0, true),
  ('Espacios de encuentro',
   'Presentaciones de libros, conversaciones con autores y actividades que favorecen la reflexión sobre la fe, la cultura y nuestro tiempo.',
   'offering', 'users', 1, true),
  ('Cuentacuentos',
   'Actividades para los más pequeños que buscan despertar el amor por la lectura, estimular la imaginación y fortalecer valores en familia.',
   'offering', 'book', 2, true),
  ('Jornadas de retiro',
   'Para adultos que deseen profundizar su vida espiritual en un espacio de silencio, oración y encuentro interior.',
   'offering', 'heart', 3, true);
