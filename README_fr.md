# File Manager CLI

🚀 **Outil rapide de manipulation de fichiers construit avec Bun**

Un outil en ligne de commande ultra-rapide pour les opérations sur fichiers (copie, déplacement, organisation) qui exploite les APIs natives de Bun pour des performances optimales.

[![Bun](https://img.shields.io/badge/Construit%20avec-Bun-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Licence MIT](https://img.shields.io/badge/Licence-MIT-green.svg)](LICENSE)

## ✨ Fonctionnalités

- **Copie de fichiers** haute performance avec les APIs natives de Bun
- **Déplacement de fichiers** efficace entre répertoires  
- **Organisation automatique** des fichiers par extension dans des dossiers catégorisés
- **Listage de fichiers** avec parcours récursif des répertoires
- **Démarrage ultra-rapide** (~134ms) grâce à la vitesse de Bun
- **Mode verbose** pour un retour détaillé des opérations

## 🚀 Installation

```bash
# Cloner et configurer
git clone <url-du-repository>
cd bun-file-manager
bun install

# Rendre exécutable (optionnel - pour exécution directe)
chmod +x index.ts

# Ou installer globalement
bun link
```

## 📖 Utilisation

```bash
# Avec bun run
bun run index.ts <commande> [options]

# Si installé globalement
fmgr <commande> [options]

# Exécution directe (si rendu exécutable)
./index.ts <commande> [options]
```

### Commandes

| Commande | Description | Exemple |
|----------|-------------|---------|
| `copy <source> <destination>` | Copier un fichier | `bun run index.ts copy document.txt backup/document.txt` |
| `move <source> <destination>` | Déplacer un fichier | `bun run index.ts move ancien-fichier.txt archive/` |
| `organize <directory> [pattern]` | Organiser les fichiers par extension | `bun run index.ts organize ~/Téléchargements` |
| `list <directory>` | Lister le contenu d'un répertoire | `bun run index.ts list . --recursive` |
| `help` | Afficher l'aide | `bun run index.ts help` |

### Options

- `--recursive, -r` - Mode récursif pour la commande list
- `--verbose, -v` - Activer la sortie détaillée
- `--pattern <pattern>` - Filtrer les fichiers par motif pour la commande organize

## 🏎️ Performance

**Performance exceptionnelle de Bun :**
- **Temps de démarrage** : ~134ms
- **Opérations sur fichiers** : ~10ms pour les opérations de copie
- **Listage de répertoires** : ~7ms pour le scan récursif

## 🔧 APIs Natives Utilisées

Cet outil exploite les APIs natives haute performance de Bun :

- `Bun.file()` - Lecture/écriture rapide de fichiers
- `Bun.Glob()` - Correspondance efficace de motifs de fichiers  
- `Bun.spawn()` - Exécution de commandes système
- `Bun.write()` - Écriture optimisée de fichiers

## 📁 Exemples

### Copier un fichier
```bash
bun run index.ts copy document.pdf sauvegarde/document.pdf --verbose
```

### Déplacer plusieurs fichiers
```bash
bun run index.ts move fichier-temp.txt archive/traité/
```

### Organiser le dossier téléchargements
```bash
# Organiser tous les fichiers par extension
bun run index.ts organize ~/Téléchargements

# Organiser seulement les fichiers PDF  
bun run index.ts organize ~/Téléchargements --pattern ".pdf"
```

### Lister les fichiers récursivement
```bash
bun run index.ts list . --recursive --verbose
```

## 🛠️ Développement

```bash
# Installer les dépendances
bun install

# Lancer en mode développement avec surveillance
bun run dev

# Exécuter directement
bun run index.ts help
```

## 🎯 Cas d'usage

### Organisation automatique
Idéal pour organiser automatiquement :
- Dossier **Téléchargements** par type de fichier
- **Archives de projets** par extension
- **Médias** par format (images, vidéos, audio)

### Opérations en lot
Parfait pour :
- **Sauvegarde rapide** de fichiers importants  
- **Migration** de fichiers entre serveurs
- **Nettoyage** et réorganisation de répertoires

## 📄 Licence

Licence MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le repository
2. Créez une branche de fonctionnalité (`git checkout -b feature/fonctionnalite-incroyable`)
3. Commitez vos changements (`git commit -m 'Ajouter fonctionnalité incroyable'`)
4. Poussez vers la branche (`git push origin feature/fonctionnalite-incroyable`)
5. Ouvrez une Pull Request

## 🐛 Issues & Support

Si vous rencontrez des bugs ou avez des demandes de fonctionnalités, veuillez [ouvrir une issue](../../issues) sur GitHub.

## 📊 Prérequis

- **Bun** >= 1.0.0
- **Node.js** (pour les tests de compatibilité)

## 🔗 Projets Connexes

- [Documentation Bun](https://bun.sh/docs)
- [TypeScript](https://www.typescriptlang.org)