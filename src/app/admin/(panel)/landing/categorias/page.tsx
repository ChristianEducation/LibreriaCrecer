import { redirect } from "next/navigation";

// La imagen panorámica de categorías ya no se usa: cada tarjeta muestra su propia
// imagen (se sube desde Categorías). Se oculta esta pantalla y se mantiene la ruta
// para que enlaces antiguos no den 404.
export default function AdminLandingCategoriasPage() {
  redirect("/admin/landing");
}
