import { z } from "zod";

/**
 * Convierte cada campo de un ZodObject en opcional para usarlo en updates parciales,
 * SIN reintroducir sus valores `.default(...)` cuando el campo viene ausente del payload.
 *
 * `schema.partial()` de Zod no sirve para esto: en la version de Zod de este proyecto,
 * un campo con `.default(...)` envuelto por `.partial()` sigue aplicando ese default
 * cuando la clave falta en el input, en vez de dejarlo simplemente sin tocar. Eso hacia
 * que cualquier PATCH/PUT parcial (por ejemplo, cambiar solo el precio desde el editor
 * rapido de /admin/productos) reseteara silenciosamente stock, categorias, destacado,
 * etc. a sus valores por defecto. Construir el objeto llamando `.optional()` directo
 * sobre cada campo del shape original evita ese problema.
 */
type OptionalShape<Shape extends z.ZodRawShape> = { [K in keyof Shape]: z.ZodOptional<Shape[K]> };

/** En Zod 4, `.removeDefault()` vive como metodo propio de cada instancia `ZodDefault`, no en su prototype. */
function unwrapDefault(fieldSchema: z.ZodTypeAny): z.ZodTypeAny {
  const withRemoveDefault = fieldSchema as z.ZodTypeAny & { removeDefault?: () => z.ZodTypeAny };
  return typeof withRemoveDefault.removeDefault === "function" ? withRemoveDefault.removeDefault() : fieldSchema;
}

export function toUpdateSchema<Shape extends z.ZodRawShape>(schema: z.ZodObject<Shape>) {
  const entries = Object.entries(schema.shape).map(([key, fieldSchema]) => [
    key,
    unwrapDefault(fieldSchema as z.ZodTypeAny).optional(),
  ]);
  const partialShape = Object.fromEntries(entries) as OptionalShape<Shape>;

  return z.object(partialShape);
}
