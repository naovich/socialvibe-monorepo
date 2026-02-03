import { ThemeSwitcher, ThemeSwitcherCompact, ThemeToggle } from './ThemeSwitcher';

/**
 * Composant de démonstration du système de thèmes
 * Affiche tous les tokens de design pour vérifier le thème actuel
 */
export function ThemeDemo() {
  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-bg-card rounded-xl shadow-lg p-6 border border-border-primary">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Système de Thèmes SocialVibe
          </h1>
          <p className="text-text-secondary">
            Démonstration de tous les tokens de design avec variables CSS + Tailwind
          </p>
        </header>

        {/* Theme Switchers */}
        <section className="bg-bg-card rounded-xl shadow-md p-6 border border-border-primary space-y-4">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Changement de Thème</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">Select Dropdown</h3>
              <ThemeSwitcher />
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">Boutons Compacts</h3>
              <ThemeSwitcherCompact />
            </div>

            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">Toggle Light/Dark</h3>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="bg-bg-card rounded-xl shadow-md p-6 border border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Couleurs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary */}
            <div className="space-y-2">
              <h3 className="font-semibold text-text-primary">Primary</h3>
              <div className="flex gap-2">
                <div className="w-16 h-16 bg-primary rounded-lg shadow-sm" title="primary" />
                <div className="w-16 h-16 bg-primary-hover rounded-lg shadow-sm" title="primary-hover" />
                <div className="w-16 h-16 bg-primary-light rounded-lg shadow-sm" title="primary-light" />
                <div className="w-16 h-16 bg-primary-dark rounded-lg shadow-sm" title="primary-dark" />
              </div>
            </div>

            {/* Backgrounds */}
            <div className="space-y-2">
              <h3 className="font-semibold text-text-primary">Backgrounds</h3>
              <div className="flex gap-2">
                <div className="w-16 h-16 bg-bg-primary border border-border-primary rounded-lg" title="bg-primary" />
                <div className="w-16 h-16 bg-bg-secondary rounded-lg" title="bg-secondary" />
                <div className="w-16 h-16 bg-bg-tertiary rounded-lg" title="bg-tertiary" />
                <div className="w-16 h-16 bg-bg-card border border-border-primary rounded-lg" title="bg-card" />
              </div>
            </div>

            {/* Semantic */}
            <div className="space-y-2">
              <h3 className="font-semibold text-text-primary">Semantic</h3>
              <div className="flex gap-2">
                <div className="w-16 h-16 bg-success rounded-lg shadow-sm" title="success" />
                <div className="w-16 h-16 bg-error rounded-lg shadow-sm" title="error" />
                <div className="w-16 h-16 bg-warning rounded-lg shadow-sm" title="warning" />
                <div className="w-16 h-16 bg-info rounded-lg shadow-sm" title="info" />
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="bg-bg-card rounded-xl shadow-md p-6 border border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Typographie</h2>
          
          <div className="space-y-3">
            <p className="text-text-primary text-lg">
              <strong>Primary:</strong> Texte principal de l'interface
            </p>
            <p className="text-text-secondary">
              <strong>Secondary:</strong> Texte secondaire pour les descriptions
            </p>
            <p className="text-text-muted text-sm">
              <strong>Muted:</strong> Texte discret pour les métadonnées
            </p>
            <p className="text-text-disabled text-sm">
              <strong>Disabled:</strong> Texte désactivé
            </p>
          </div>
        </section>

        {/* Buttons */}
        <section className="bg-bg-card rounded-xl shadow-md p-6 border border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Boutons</h2>
          
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-primary">
              Primary
            </button>
            <button className="px-4 py-2 bg-bg-secondary text-text-primary rounded-lg hover:bg-bg-tertiary transition-colors border border-border-primary">
              Secondary
            </button>
            <button className="px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition-opacity">
              Success
            </button>
            <button className="px-4 py-2 bg-error text-white rounded-lg hover:opacity-90 transition-opacity">
              Error
            </button>
            <button className="px-4 py-2 bg-warning text-white rounded-lg hover:opacity-90 transition-opacity">
              Warning
            </button>
            <button className="px-4 py-2 bg-info text-white rounded-lg hover:opacity-90 transition-opacity">
              Info
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="bg-bg-card rounded-xl shadow-md p-6 border border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Cards & Shadows</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-bg-card p-4 rounded-lg shadow-sm border border-border-primary">
              <p className="font-medium text-text-primary">Shadow SM</p>
              <p className="text-sm text-text-muted">Ombre légère</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg shadow-md border border-border-primary">
              <p className="font-medium text-text-primary">Shadow MD</p>
              <p className="text-sm text-text-muted">Ombre moyenne</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg shadow-lg border border-border-primary">
              <p className="font-medium text-text-primary">Shadow LG</p>
              <p className="text-sm text-text-muted">Ombre large</p>
            </div>
            <div className="bg-bg-card p-4 rounded-lg shadow-xl border border-border-primary">
              <p className="font-medium text-text-primary">Shadow XL</p>
              <p className="text-sm text-text-muted">Ombre très large</p>
            </div>
          </div>
        </section>

        {/* Special Effects */}
        <section className="bg-bg-card rounded-xl shadow-md p-6 border border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Effets Spéciaux</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-effect p-6 rounded-lg">
              <p className="font-medium text-text-primary">Glass Effect</p>
              <p className="text-sm text-text-muted">Effet de verre givré</p>
            </div>
            
            <div className="gradient-primary p-6 rounded-lg text-white">
              <p className="font-medium">Gradient Primary</p>
              <p className="text-sm opacity-90">Dégradé de la couleur primaire</p>
            </div>
            
            <div className="bg-bg-secondary p-6 rounded-lg border border-border-primary">
              <p className="text-gradient-primary font-bold text-xl">Text Gradient</p>
              <p className="text-sm text-text-muted">Texte avec dégradé</p>
            </div>
          </div>
        </section>

        {/* Forms */}
        <section className="bg-bg-card rounded-xl shadow-md p-6 border border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Formulaires</h2>
          
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Input Standard
              </label>
              <input
                type="text"
                placeholder="Entrez du texte..."
                className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Textarea
              </label>
              <textarea
                placeholder="Votre message..."
                rows={3}
                className="w-full px-3 py-2 bg-bg-primary border border-border-primary rounded-lg text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="demo-checkbox"
                className="w-4 h-4 text-primary border-border-primary rounded focus:ring-2 focus:ring-primary/20"
              />
              <label htmlFor="demo-checkbox" className="text-sm text-text-primary">
                Accepter les conditions
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
