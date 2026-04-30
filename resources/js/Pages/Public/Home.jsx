import { Head, Link, router } from '@inertiajs/react';
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Car,
  ChevronRight,
  MapPin,
  Search,
  Snowflake,
  Sparkles,
  Users,
} from 'lucide-react';

const fallbackHeroImage =
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&h=900&fit=crop';

function formatPlanLabel(plan) {
  const normalized = String(plan ?? '').toLowerCase();

  if (!normalized) {
    return 'Plan';
  }

  if (normalized === 'pro') {
    return 'Pro';
  }

  if (normalized === 'standard') {
    return 'Standard';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatCapacity(value) {
  if (!value) {
    return 'Capacite non precisee';
  }

  return `${Number(value).toLocaleString('fr-FR')} invites`;
}

function hallLocation(hall) {
  return [hall.commune, hall.wilaya].filter(Boolean).join(', ') || hall.domain || 'Algerie';
}

function hallSearchText(hall) {
  return [
    hall.name,
    hall.domain,
    hall.plan,
    hall.wilaya,
    hall.commune,
    hall.address,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function Navbar({ canLogin, canRegister }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href={route('central.home')} className="group flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 blur-md opacity-70 transition-opacity group-hover:opacity-100"></div>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-xl font-black text-transparent">
              EventHub
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Marketplace salles
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#catalogue" className="text-sm font-semibold text-stone-600 transition hover:text-amber-600">
            Catalogue
          </a>
          <a href="#recherche" className="text-sm font-semibold text-stone-600 transition hover:text-amber-600">
            Recherche
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {canLogin && (
            <Link
              href="/login"
              className="hidden rounded-xl border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50 sm:inline-flex"
            >
              Se connecter
            </Link>
          )}
          {canRegister && (
            <Link
              href="/register"
              className="inline-flex rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
            >
              Ajouter ma salle
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function Hero({ stats }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"></div>
        <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-rose-500/15 blur-3xl"></div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            <CalendarDays className="h-4 w-4 text-amber-300" />
            <span>{stats.activeHalls} salles actives disponibles aujourd hui</span>
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Trouvez une salle disponible dans notre SaaS
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-300">
            Le catalogue public affiche les salles actives de votre plateforme avec leurs informations principales et un acces direct a la fiche de reservation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalogue"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-stone-950 transition hover:bg-stone-100"
            >
              Voir les salles
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#recherche"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Rechercher
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
            <img
              src={fallbackHeroImage}
              alt="Catalogue public des salles"
              className="h-full min-h-[320px] w-full rounded-[1.4rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchPanel({ filters, halls }) {
  const [query, setQuery] = useState(filters.search ?? '');
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredCount = normalizedQuery
    ? halls.filter((hall) => hallSearchText(hall).includes(normalizedQuery)).length
    : halls.length;

  useEffect(() => {
    setQuery(filters.search ?? '');
  }, [filters.search]);

  const submitSearch = (event) => {
    event.preventDefault();

    startTransition(() => {
      router.get(
        route('central.halls.index'),
        query.trim() ? { search: query.trim() } : {},
        { preserveScroll: true, preserveState: true, replace: true },
      );
    });
  };

  return (
    <section id="recherche" className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-600">
            Recherche
          </p>
          <h2 className="mt-2 text-3xl font-black text-stone-900">
            Filtrer les salles disponibles
          </h2>
          <p className="mt-2 text-sm leading-7 text-stone-600">
            Recherchez par nom, commune, wilaya, domaine ou plan.
          </p>
        </div>
        <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-semibold text-stone-700">
          {filteredCount} salle{filteredCount > 1 ? 's' : ''} affichee{filteredCount > 1 ? 's' : ''}
        </div>
      </div>

      <form onSubmit={submitSearch} className="mt-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
            <Search className="h-5 w-5 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex: Nour Palace, Alger, pro..."
              className="w-full border-0 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:ring-0"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
          >
            Lancer la recherche
          </button>
        </div>
      </form>
    </section>
  );
}

function HallCard({ hall }) {
  const image = hall.cover_photo_url || fallbackHeroImage;

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <img src={image} alt={hall.name} className="h-56 w-full object-cover" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
              {formatPlanLabel(hall.plan)}
            </div>
            <h3 className="mt-3 text-2xl font-black text-stone-900">{hall.name}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-stone-500">
              <MapPin className="h-4 w-4" />
              <span>{hallLocation(hall)}</span>
            </div>
          </div>
        </div>

        {hall.address && (
          <p className="mt-4 text-sm leading-7 text-stone-600">
            {hall.address}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700">
            <Users className="h-3.5 w-3.5" />
            {formatCapacity(hall.capacity_max)}
          </span>
          {hall.parking_capacity ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <Car className="h-3.5 w-3.5" />
              Parking {hall.parking_capacity}
            </span>
          ) : null}
          {hall.has_air_conditioning && (
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
              <Snowflake className="h-3.5 w-3.5" />
              Climatisation
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={hall.url}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Voir la salle
          </a>
          <a
            href={hall.booking_url}
            className="inline-flex items-center justify-center rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Reserver
          </a>
        </div>
      </div>
    </article>
  );
}

function HallGrid({ halls, filters }) {
  const normalizedQuery = (filters.search ?? '').trim().toLowerCase();
  const displayedHalls = normalizedQuery
    ? halls.filter((hall) => hallSearchText(hall).includes(normalizedQuery))
    : halls;

  return (
    <section id="catalogue" className="space-y-8">
      <SearchPanel filters={filters} halls={halls} />

      {displayedHalls.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {displayedHalls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
          <p className="text-2xl font-black text-stone-900">Aucune salle trouvee</p>
          <p className="mt-3 text-sm text-stone-600">
            Essayez une autre recherche avec un nom, une commune ou un plan.
          </p>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-stone-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>EventHub centralise la vitrine publique de vos salles actives.</p>
        <Link href={route('central.home')} className="font-semibold text-amber-600 transition hover:text-amber-700">
          Retour a l accueil
        </Link>
      </div>
    </footer>
  );
}

export default function Home({
  filters = { search: '' },
  halls = [],
  stats = { activeHalls: 0 },
  canLogin = false,
  canRegister = false,
}) {
  return (
    <>
      <Head title="Catalogue des salles disponibles" />
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50">
        <Navbar canLogin={canLogin} canRegister={canRegister} />
        <Hero stats={stats} />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <HallGrid halls={halls} filters={filters} />
        </main>
        <Footer />
      </div>
    </>
  );
}
