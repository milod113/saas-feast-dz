import ScrollReveal from '@/Components/ScrollReveal';
import { Head, Link, router } from '@inertiajs/react';
import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Gift,
  Globe,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Calendrier interactif',
    description: 'Visualisez et gerez toutes vos reservations en temps reel avec des alertes intelligentes.',
    color: 'from-amber-400 to-orange-400',
  },
  {
    icon: CreditCard,
    title: 'Paiements securises',
    description: 'Acceptez les acomptes, suivez les soldes et automatisez les rappels de paiement.',
    color: 'from-emerald-400 to-teal-400',
  },
  {
    icon: Users,
    title: 'Espace client premium',
    description: 'Donnez a vos clients un portail clair pour consulter reservations, paiements et documents.',
    color: 'from-fuchsia-400 to-rose-400',
  },
  {
    icon: FileText,
    title: 'Contrats et devis',
    description: 'Generez des documents professionnels avec un parcours plus simple pour votre equipe.',
    color: 'from-sky-400 to-cyan-400',
  },
  {
    icon: BarChart3,
    title: 'Statistiques avancees',
    description: 'Suivez vos performances, votre taux d occupation et vos revenus en un coup d oeil.',
    color: 'from-rose-400 to-red-400',
  },
  {
    icon: Bell,
    title: 'Notifications automatiques',
    description: 'Envoyez confirmations, rappels et factures par email ou SMS selon votre organisation.',
    color: 'from-indigo-400 to-violet-400',
  },
];

const hallAccentGradients = [
  'from-amber-500 to-rose-500',
  'from-emerald-500 to-cyan-500',
  'from-sky-500 to-indigo-500',
  'from-orange-500 to-pink-500',
];

const planTheme = {
  standard: {
    badge: 'from-stone-700 to-stone-900',
    panel: 'from-stone-50 to-white',
  },
  pro: {
    badge: 'from-amber-500 to-rose-500',
    panel: 'from-amber-50 to-rose-50',
  },
};

function formatPlanLabel(plan) {
  const normalized = String(plan ?? '').toLowerCase();

  if (normalized === 'pro') {
    return 'Pro';
  }

  if (normalized === 'standard') {
    return 'Standard';
  }

  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Plan';
}

function hallLocation(hall) {
  return [hall.commune, hall.wilaya].filter(Boolean).join(', ') || hall.domain || 'Algerie';
}

function formatCapacity(value) {
  if (!value) {
    return 'Capacite flexible';
  }

  return `${Number(value).toLocaleString('fr-FR')} invites`;
}

function hallNeedles(hall) {
  return [
    hall.name,
    hall.domain,
    hall.plan,
    hall.wilaya,
    hall.commune,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function Navbar({ canLogin, canRegister }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Fonctionnalites', href: '#features' },
    { name: 'Explorer', href: '#explore' },
    { name: 'Tarifs', href: '#pricing' },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-md dark:bg-stone-900/95' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 blur-lg opacity-75 transition-opacity group-hover:opacity-100"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-xl font-black text-transparent dark:from-amber-400 dark:to-rose-400">
              EventHub
            </span>
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-stone-600 transition-colors hover:text-amber-600 dark:text-stone-300 dark:hover:text-amber-400"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            {canLogin && (
              <Link
                href="/login"
                className="rounded-xl border-2 border-amber-500 px-5 py-2 text-sm font-semibold text-amber-600 transition-all hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950/30"
              >
                Se connecter
              </Link>
            )}
            {canRegister && (
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-xl"
              >
                Essai gratuit
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 md:hidden"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-current transition-transform ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-transform ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
            </div>
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-3 pb-6 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 text-sm font-semibold text-stone-600 transition-colors hover:text-amber-600 dark:text-stone-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col space-y-3 pt-4">
              {canLogin && (
                <Link href="/login" className="rounded-xl border-2 border-amber-500 px-5 py-2 text-center text-sm font-semibold text-amber-600">
                  Se connecter
                </Link>
              )}
              {canRegister && (
                <Link href="/register" className="rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-2 text-center text-sm font-semibold text-white shadow-lg">
                  Essai gratuit
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Hero({ stats, canRegister }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-stone-50 via-white to-amber-50 pt-32 dark:from-stone-950 dark:via-stone-900 dark:to-amber-950/20">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-amber-300 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-rose-300 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-950/50">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                {stats.activeHalls} salles actives et un pilotage plus fluide
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-stone-900 to-stone-600 bg-clip-text text-transparent dark:from-white dark:to-stone-400">
                Gerez vos salles
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                comme un expert
              </span>
            </h1>

            <p className="mb-8 text-lg text-stone-600 dark:text-stone-400 lg:text-xl">
              Une landing unique qui vend votre SaaS et permet aussi aux visiteurs d explorer directement les salles disponibles.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              {canRegister && (
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105"
                >
                  <span>Commencez gratuitement</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform group-hover:translate-x-0"></div>
                </Link>
              )}
              <a
                href="#explore"
                className="flex items-center gap-2 rounded-xl border-2 border-stone-300 px-8 py-4 text-lg font-semibold text-stone-700 transition-all hover:border-amber-500 hover:bg-amber-50 dark:border-stone-700 dark:text-stone-300"
              >
                Explorer les salles
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-stone-600 dark:text-stone-400">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-stone-600 dark:text-stone-400">{stats.availablePlans} plans actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-sky-500" />
                <span className="text-sm text-stone-600 dark:text-stone-400">{stats.tenantBaseDomain}</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-rose-400 opacity-20 blur-3xl"></div>
            <div className="relative overflow-hidden rounded-3xl bg-white/80 p-3 shadow-2xl backdrop-blur-sm dark:bg-stone-800/80">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=900&fit=crop"
                alt="Dashboard de gestion des salles"
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white p-4 shadow-xl dark:bg-stone-800 sm:-left-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 dark:bg-emerald-950">
                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-stone-900 dark:text-white">+47%</p>
                    <p className="text-xs text-stone-600 dark:text-stone-400">de reservations suivies</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-2 top-6 rounded-2xl bg-stone-950/90 px-4 py-3 text-white shadow-xl backdrop-blur sm:-right-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <div>
                    <p className="text-sm font-semibold">Recherche instantanee</p>
                    <p className="text-xs text-stone-300">Suggestions avant le clic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-950/50">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Fonctionnalites completes
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-black text-stone-900 dark:text-white sm:text-5xl">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            Une plateforme tout en un qui centralise gestion, paiements et relation client.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-stone-800/50"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 transition-opacity group-hover:opacity-100`}
                style={{
                  padding: '2px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              ></div>

              <div className="relative">
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${feature.color} p-3 shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-stone-900 dark:text-white">{feature.title}</h3>
                <p className="text-stone-600 dark:text-stone-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HallExplorer({ halls, filters }) {
  const [query, setQuery] = useState(filters.search ?? '');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(filters.search ?? '');
  }, [filters.search]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const suggestedHalls = !normalizedQuery
    ? halls.slice(0, 4)
    : halls.filter((hall) => hallNeedles(hall).includes(normalizedQuery)).slice(0, 6);

  const highlight = suggestedHalls[0];

  const submitSearch = (event) => {
    event.preventDefault();

    startTransition(() => {
      router.get(
        '/',
        query.trim() ? { search: query.trim() } : {},
        { preserveScroll: true, preserveState: true, replace: true },
      );
    });
  };

  return (
    <section id="explore" className="relative py-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-50/70 to-transparent dark:from-amber-950/10"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-white dark:bg-stone-100 dark:text-stone-900">
            <Search className="h-4 w-4" />
            <span className="text-xs font-semibold">Explorer les salles</span>
          </div>
          <h2 className="mb-4 text-4xl font-black text-stone-900 dark:text-white sm:text-5xl">
            Recherchez sans casser l experience
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-stone-600 dark:text-stone-400">
            Strategie moderne: suggestions immediates pendant la saisie, puis liste complete apres validation pour garder un parcours clair.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-stone-800 dark:bg-stone-900/80">
            <form onSubmit={submitSearch} className="rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-950">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 dark:bg-stone-900">
                  <Search className="h-5 w-5 text-stone-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Nom, domaine, commune ou plan"
                    className="w-full border-0 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:ring-0 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  Voir les salles
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {['mariage', 'standard', 'pro', 'alger', 'oran'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-amber-400 hover:text-amber-600 dark:border-stone-700 dark:text-stone-300"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  {normalizedQuery ? 'Suggestions instantanees' : 'Salles en avant'}
                </h3>
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {suggestedHalls.length} resultat{suggestedHalls.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {suggestedHalls.length > 0 ? (
                  suggestedHalls.map((hall, index) => (
                    <article
                      key={hall.id}
                      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
                    >
                      <div className={`h-2 bg-gradient-to-r ${hallAccentGradients[index % hallAccentGradients.length]}`}></div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-lg font-bold text-stone-900 transition group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                              {hall.name}
                            </h4>
                            <div className="mt-2 flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                              <MapPin className="h-4 w-4" />
                              <span>{hallLocation(hall)}</span>
                            </div>
                          </div>
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                            {formatPlanLabel(hall.plan)}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            {formatCapacity(hall.capacity_max)}
                          </span>
                          {hall.has_air_conditioning && (
                            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                              Climatisation
                            </span>
                          )}
                          {hall.parking_capacity ? (
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              Parking {hall.parking_capacity}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {hall.booking_url && (
                            <a
                              href={hall.booking_url}
                              className="inline-flex items-center justify-center rounded-xl bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-950"
                            >
                              Reserver
                            </a>
                          )}
                          {hall.url && (
                            <a
                              href={hall.url}
                              className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                            >
                              Voir la salle
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 md:col-span-2 dark:border-stone-700 dark:bg-stone-900">
                    <p className="text-lg font-semibold text-stone-900 dark:text-white">Aucune salle trouvee</p>
                    <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                      Essayez un nom de salle, un domaine ou un plan comme Standard ou Pro.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 text-white shadow-xl">
              <div className="inline-flex rounded-2xl bg-white/10 p-3">
                <Star className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="mt-5 text-2xl font-black">Recherche orientee conversion</h3>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Les visiteurs voient d abord des suggestions immediates, puis une liste plus detaillee apres validation. C est plus moderne qu un simple formulaire vide et plus propre qu un mega filtre complexe.
              </p>
              {highlight && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Suggestion en tete</p>
                  <p className="mt-2 text-lg font-bold">{highlight.name}</p>
                  <p className="mt-1 text-sm text-stone-300">{hallLocation(highlight)}</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-lg dark:border-stone-800 dark:bg-stone-900">
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">Bonnes pratiques gardees</h3>
              <div className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-400">
                <p>Recherche immediate cote client pour la sensation de vitesse.</p>
                <p>Validation serveur avec URL partageable via le parametre `search`.</p>
                <p>Pas de refonte brutale: meme palette, memes cartes, meme rythme visuel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ plans, canRegister }) {
  return (
    <section id="pricing" className="bg-gradient-to-br from-stone-50 to-amber-50/30 py-24 dark:from-stone-950 dark:to-amber-950/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-950/50">
            <Gift className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Plans reels detectes dans votre base
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-black text-stone-900 dark:text-white sm:text-5xl">
            Des plans alignes avec votre activite
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-600 dark:text-stone-400">
            Les cartes ci dessous s appuient sur les plans actuellement utilises par vos tenants actifs.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const normalized = String(plan.slug ?? '').toLowerCase();
            const theme = planTheme[normalized] ?? planTheme.standard;

            return (
              <div
                key={plan.slug}
                className={`relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-stone-800/50 ${
                  plan.popular ? 'scale-[1.02] border-2 border-amber-500' : 'border border-stone-200 dark:border-stone-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-1">
                    <span className="text-xs font-bold text-white">Le plus populaire</span>
                  </div>
                )}

                <div className={`mb-6 rounded-2xl bg-gradient-to-br ${theme.panel} p-5 dark:from-stone-900 dark:to-stone-800`}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900 dark:text-white">{plan.name}</h3>
                      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{plan.description}</p>
                    </div>
                    <div className={`rounded-xl bg-gradient-to-r ${theme.badge} p-3 text-white shadow-lg`}>
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-black text-stone-900 dark:text-white">{plan.price}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                    {plan.tenantCount} salle{plan.tenantCount > 1 ? 's' : ''} active{plan.tenantCount > 1 ? 's' : ''}
                  </p>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {canRegister ? (
                  <Link
                    href="/register"
                    className={`block w-full rounded-xl py-3 text-center font-semibold transition-all ${
                      plan.buttonVariant === 'gradient'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:scale-105'
                        : 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50 dark:text-amber-400'
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                ) : (
                  <a
                    href="#explore"
                    className="block w-full rounded-xl border-2 border-amber-500 py-3 text-center font-semibold text-amber-600 transition-all hover:bg-amber-50 dark:text-amber-400"
                  >
                    Explorer les salles
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="col-span-1">
            <div className="mb-4 flex items-center space-x-2">
              <div className="rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black text-stone-900 dark:text-white">EventHub</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Une vitrine plus commerciale, sans perdre la logique SaaS et marketplace.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-stone-900 dark:text-white">Produit</h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><a href="#features" className="transition hover:text-amber-600">Fonctionnalites</a></li>
              <li><a href="#explore" className="transition hover:text-amber-600">Explorer</a></li>
              <li><a href="#pricing" className="transition hover:text-amber-600">Tarifs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-stone-900 dark:text-white">Support</h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><a href="/login" className="transition hover:text-amber-600">Connexion</a></li>
              <li><a href="/register" className="transition hover:text-amber-600">Inscription</a></li>
              <li><a href="#explore" className="transition hover:text-amber-600">Recherche</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-stone-900 dark:text-white">Reseaux</h4>
            <div className="flex gap-4">
              <a href="#" className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 hover:text-amber-600 dark:text-stone-400 dark:hover:bg-stone-800">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 hover:text-amber-600 dark:text-stone-400 dark:hover:bg-stone-800">
                <Camera className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 hover:text-amber-600 dark:text-stone-400 dark:hover:bg-stone-800">
                <BriefcaseBusiness className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-stone-600 transition hover:bg-stone-100 hover:text-amber-600 dark:text-stone-400 dark:hover:bg-stone-800">
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-8 dark:border-stone-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              (c) {currentYear} EventHub. Tous droits reserves.
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Recherche moderne, visuel stable, donnees reelles.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Welcome({
  filters = { search: '' },
  halls = [],
  plans = [],
  stats = { activeHalls: 0, availablePlans: 0, tenantBaseDomain: '' },
  canLogin = false,
  canRegister = false,
}) {
  return (
    <>
      <Head title="EventHub - Gestion de salles professionnelle" />
      <div className="min-h-screen bg-white dark:bg-stone-950">
        <Navbar canLogin={canLogin} canRegister={canRegister} />
        <ScrollReveal>
          <Hero stats={stats} canRegister={canRegister} />
        </ScrollReveal>
        <ScrollReveal>
          <Features />
        </ScrollReveal>
        <ScrollReveal>
          <HallExplorer halls={halls} filters={filters} />
        </ScrollReveal>
        <ScrollReveal>
          <Pricing plans={plans} canRegister={canRegister} />
        </ScrollReveal>
        <ScrollReveal>
          <Footer />
        </ScrollReveal>
      </div>
    </>
  );
}
