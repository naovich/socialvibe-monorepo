# 📋 Tasks System

## Structure

Chaque jour a son propre fichier de tâches : `YYYY-MM-DD.md`

### Format des Tâches

```markdown
## 🎯 Objectif du Jour
Description de l'objectif principal.

## Section 1
- [ ] Tâche non faite
- [x] Tâche complétée

## Section 2
- [ ] Autre tâche
```

### Priorités

- 🔴 **Priorité 1** : Urgent et important (à faire en premier)
- 🟡 **Priorité 2** : Important mais non urgent
- 🟢 **Priorité 3** : Nice to have

### Workflow

1. Consulter le fichier du jour (`tasks/YYYY-MM-DD.md`)
2. Cocher les tâches au fur et à mesure avec `[x]`
3. Créer le fichier du lendemain en fin de journée
4. Archiver les tâches complétées

### Commandes Utiles

```bash
# Voir les tâches d'aujourd'hui
cat tasks/$(date +%Y-%m-%d).md

# Compter les tâches complétées
grep -c "\\[x\\]" tasks/$(date +%Y-%m-%d).md

# Compter les tâches restantes
grep -c "\\[ \\]" tasks/$(date +%Y-%m-%d).md
```

---

**Note:** Les fichiers de tâches passés sont conservés pour historique.
