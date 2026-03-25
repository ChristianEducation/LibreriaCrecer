import { Button } from "@/shared/ui";

function CrossMark() {
  return (
    <span className="relative mb-8 block h-20 w-20 text-moss/8">
      <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 rounded-[1px] bg-current" />
      <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-[1px] bg-current" />
    </span>
  );
}

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-beige px-6 text-center">
      <CrossMark />
      <p className="font-serif text-[120px] leading-none text-beige-mid">404</p>
      <h1 className="mt-2 font-serif text-[28px] text-moss">Pagina no encontrada</h1>
      <p className="mt-3 text-sm font-light text-text-light">
        El contenido que buscas no existe o fue movido.
      </p>
      <Button as="a" className="mt-8" href="/" variant="moss">
        Volver al inicio
      </Button>
      <Button as="a" className="mt-2" href="/productos" variant="ghost">
        Ver coleccion →
      </Button>
    </main>
  );
}
