import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Encuentros Crecer",
  description: "Galería de eventos, talleres y encuentros organizados por Crecer Librería Católica.",
  alternates: {
    canonical: "/encuentros",
  },
};

export default async function EncuentrosPage() {
  redirect("/nosotros#encuentros");
}
