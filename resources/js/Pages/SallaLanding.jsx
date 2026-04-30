// filepath: resources/js/Pages/SallaLanding.jsx
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Crown,
  Building2,
  Gem,
  Calendar,
  CreditCard,
  Shield,
  Clock,
  Heart
} from 'lucide-react';

// Mock data for halls
const halls = [
  {
    id: 1,
    name: 'Palais des Fêtes El Andalouss',
    location: 'Alger, Algérie',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=500&fit=crop',
    capacity: 500,
    rating: 4.9,
    featured: true
  },
  {
    id: 2,
    name: 'Villa Belle Vue',
    location: 'Oran, Algérie',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop',
    capacity: 200,
    rating: 4.7,
    featured: false
  },
  {
    id: 3,
    name: 'Salle Horizon',
    location: 'Constantine, Algérie',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=500&fit=crop',
    capacity: 350,
    rating: 4.8,
    featured: true
  },
  {
    id: 4,
    name: 'Domaine Les Oliviers',
    location: 'Blida, Algérie',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=500&fit=crop',
    capacity: 250,
    rating: 4.6,
    featured: false
  }
];

// Plans data
const plans = [
  {
    name: 'Basic',
    price: 4900,
    period: 'mois',
    description: 'Parfait pour démarrer',
    icon: Building2,
    features: [
      'Jusqu\'à 50 réservations/mois',
      'Gestion des clients',
      'Calendrier interactif',
      'Support par email',
      'Statistiques basiques'
    ],
    popular: false,
    color: 'from-stone-600 to-stone-800'
  },
  {
    name: 'Premium',
    price: 9900,
    period: 'mois',
    description: 'La solution complète',
    icon: Crown,
    features: [
      'Réservations illimitées',
      'Paiements en ligne',
      'Contrats & Devis',
      'Portail client personnalisé',
      'Support prioritaire 24/7',
      'Export de données'
    ],
    popular: true,
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Enterprise',
    price: 19900,
    period: 'mois',
    description: 'Pour les pros',
    icon: Gem,
    features: [
      'Multi-salles illimité',
      'API personnalisée',
      'Marque blanche',
      'Formation dédiée',
      'Account manager',
      'Intégrations sur mesure'
    ],
    popular: false,
    color: 'from-yellow-600 to-amber-800'
  }
];

// Scroll Reveal Component
const ScrollReveal = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.25, 0.25, 0.75] }}
  >
    {children}
  </motion.div>
);

// Navbar Component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-stone-950/95 backdrop-blur-xl border-b border-amber-500/20' 
        : 'bg-transparent'
    }`}>
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 blur-md opacity-70"></div>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-white">Salla</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                SaaS salles
              </span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#listings" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors">
              Salles
            </a>
            <a href="#pricing" className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors">
              Tarifs
            </a>
            <Link
              href="/register"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
            >
              <span className="relative z-10">Inscrire ma salle</span>
              <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-0"></div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-950">
    {/* Background Effects */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-yellow-600/8 blur-[100px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0c0a09_100%)]"></div>
    </div>
    
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

    <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
      <ScrollReveal>
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold text-amber-300">
            La plateforme N°1 en Algérie
          </span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h1 className="mb-6 text-5xl md:text-7xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-white via-stone-200 to-stone-400 bg-clip-text text-transparent">
            Gérez vos salles
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
            comme un professionnel
          </span>
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-stone-400 md:text-xl">
          La solution tout-en-un pour automatiser vos réservations, 
          gérer vos paiements et offrir une expérience premium à vos clients.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-500/50"
          >
            <span>Inscrire ma salle</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform group-hover:translate-x-0"></div>
          </Link>
          <a
            href="#listings"
            className="rounded-2xl border border-stone-700 bg-stone-900/50 px-8 py-4 text-lg font-semibold text-stone-300 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:bg-stone-800/50"
          >
            Découvrir les salles
          </a>
        </div>
      </ScrollReveal>

      {/* Trust Badges */}
      <ScrollReveal delay={0.4}>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-stone-400">+500 salles</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-stone-400">4.9/5 note</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-stone-400">Paiement sécurisé</span>
          </div>
        </div>
      </ScrollReveal>
    </div>

    {/* Bottom Gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-950 to-transparent"></div>
  </section>
);

// Listings Section
const Listings = () => (
  <section id="listings" className="relative py-24 bg-stone-950">
    {/* Gradient Separator */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
    
    <div className="mx-auto max-w-7xl px-6">
      <ScrollReveal>
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
            <Building2 className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Nos Salles
            </span>
          </div>
          <h2 className="mb-4 text-4xl md:text-5xl font-black text-white">
            Découvrez nos <span className="text-amber-500">salles</span> partenaires
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Une sélection exclusive de salles de réception pour vos événements inoubliables
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {halls.map((hall, index) => (
          <ScrollReveal key={hall.id} delay={index * 0.1}>
            <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-stone-900/50 backdrop-blur-sm transition-all hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hall.image}
                  alt={hall.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
                {hall.featured && (
                  <div className="absolute top-3 right-3 rounded-full bg-amber-500 px-3 py-1">
                    <span className="text-xs font-bold text-stone-950">Featured</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {hall.name}
                </h3>
                <div className="mb-3 flex items-center gap-1 text-stone-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{hall.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-semibold text-white">{hall.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-400">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{hall.capacity}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-800">
                  <span className="text-2xl font-black text-amber-500">{hall.price.toLocaleString()} </span>
                  <span className="text-sm text-stone-400">DZD</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-12 text-center">
          <Link
            href={route('central.halls.index')}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span className="font-semibold">Voir toutes les salles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

// Pricing Section
const Pricing = () => (
  <section id="pricing" className="relative py-24 bg-stone-950">
    {/* Gradient Transition */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
    
    <div className="mx-auto max-w-7xl px-6">
      <ScrollReveal>
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              Tarifs
            </span>
          </div>
          <h2 className="mb-4 text-4xl md:text-5xl font-black text-white">
            Choisissez votre <span className="text-amber-500">plan</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-stone-400">
            Des formules adaptées à vos besoins, avec un essai gratuit de 14 jours
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <ScrollReveal key={plan.name} delay={index * 0.1}>
            <div className={`relative overflow-hidden rounded-2xl border bg-stone-900/50 backdrop-blur-sm transition-all hover:shadow-2xl ${
              plan.popular 
                ? 'border-amber-500 shadow-amber-500/20 scale-105' 
                : 'border-stone-800 hover:border-amber-500/50'
            }`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-600 py-2 text-center">
                  <span className="text-xs font-bold text-stone-950">Le plus populaire</span>
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <div className="mb-6 flex items-center gap-3">
                  <div className={`rounded-xl bg-gradient-to-r ${plan.color} p-3`}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-stone-400">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-black text-white">{plan.price.toLocaleString()} </span>
                  <span className="text-stone-400">DZD/{plan.period}</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-stone-300">
                      <CheckCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block w-full rounded-xl py-3 text-center font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 hover:scale-105'
                      : 'border border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                  }`}
                >
                  Commencer l'essai gratuit
                </Link>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>

    {/* Bottom Gradient */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-900 to-transparent"></div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="relative border-t border-stone-800 bg-stone-950 py-16">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid gap-12 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Salla</span>
          </div>
          <p className="text-sm text-stone-400">
            La plateforme de gestion de salles de réception N°1 en Algérie.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Produit</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><a href="#listings" className="hover:text-amber-400 transition-colors">Salles</a></li>
            <li><a href="#pricing" className="hover:text-amber-400 transition-colors">Tarifs</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Fonctionnalités</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Support</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><a href="#" className="hover:text-amber-400 transition-colors">Aide</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">Statut</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Légal</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li><a href="#" className="hover:text-amber-400 transition-colors">Confidentialité</a></li>
            <li><a href="#" className="hover:text-amber-400 transition-colors">CGU</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-stone-800">
        <p className="text-center text-sm text-stone-500">
          © {new Date().getFullYear()} Salla. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
);

// Main Page
export default function SallaLanding() {
  return (
    <>
      <Head title="Salla - Gestion de salles de réception" />
      <div className="min-h-screen bg-stone-950 font-urbanist">
        <Navbar />
        <Hero />
        <Listings />
        <Pricing />
        <Footer />
      </div>
    </>
  );
}
