#!/usr/bin/env bun

import { parseArgs } from "util";
import { existsSync, lstatSync } from "fs";
import { join, dirname, basename, extname } from "path";

interface FileManagerOptions {
  source?: string;
  destination?: string;
  pattern?: string;
  recursive?: boolean;
  verbose?: boolean;
}

class FileManager {
  private verbose: boolean = false;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  private log(message: string) {
    if (this.verbose) {
      console.log(`[INFO] ${message}`);
    }
  }

  private async ensureDirectory(path: string) {
    const dir = dirname(path);
    if (!existsSync(dir)) {
      await Bun.write(Bun.file(dir), "");
      this.log(`Répertoire créé: ${dir}`);
    }
  }

  async copyFile(source: string, destination: string): Promise<void> {
    try {
      if (!existsSync(source)) {
        throw new Error(`Le fichier source n'existe pas: ${source}`);
      }

      await this.ensureDirectory(destination);
      
      const sourceFile = Bun.file(source);
      const content = await sourceFile.arrayBuffer();
      
      await Bun.write(destination, content);
      
      this.log(`Fichier copié: ${source} → ${destination}`);
      console.log(`✅ Copie réussie: ${basename(source)}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la copie: ${error instanceof Error ? error.message : error}`);
    }
  }

  async moveFile(source: string, destination: string): Promise<void> {
    try {
      if (!existsSync(source)) {
        throw new Error(`Le fichier source n'existe pas: ${source}`);
      }

      await this.copyFile(source, destination);
      
      // Utiliser l'API native de Bun pour supprimer le fichier
      const unlinkResult = await Bun.spawn(["rm", source]).exited;
      if (unlinkResult !== 0) {
        throw new Error(`Impossible de supprimer le fichier source: ${source}`);
      }

      this.log(`Fichier déplacé: ${source} → ${destination}`);
      console.log(`✅ Déplacement réussi: ${basename(source)}`);
    } catch (error) {
      console.error(`❌ Erreur lors du déplacement: ${error instanceof Error ? error.message : error}`);
    }
  }

  async organizeFiles(directory: string, pattern?: string): Promise<void> {
    try {
      if (!existsSync(directory)) {
        throw new Error(`Le répertoire n'existe pas: ${directory}`);
      }

      const entries = await Array.fromAsync(new Bun.Glob("*").scan({ cwd: directory }));
      
      for (const entry of entries) {
        const fullPath = join(directory, entry);
        const stats = lstatSync(fullPath);
        
        if (stats.isFile()) {
          if (!pattern || entry.includes(pattern)) {
            const ext = extname(entry).toLowerCase().slice(1) || "sans-extension";
            const targetDir = join(directory, ext);
            const targetPath = join(targetDir, entry);
            
            if (!existsSync(targetDir)) {
              await Bun.spawn(["mkdir", "-p", targetDir]).exited;
              this.log(`Répertoire créé: ${targetDir}`);
            }
            
            await this.moveFile(fullPath, targetPath);
          }
        }
      }

      console.log(`✅ Organisation terminée pour: ${directory}`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'organisation: ${error instanceof Error ? error.message : error}`);
    }
  }

  async listFiles(directory: string, recursive: boolean = false): Promise<void> {
    try {
      const pattern = recursive ? "**/*" : "*";
      const glob = new Bun.Glob(pattern);
      const files = await Array.fromAsync(glob.scan({ cwd: directory }));
      
      console.log(`📁 Contenu de ${directory}:`);
      for (const file of files.sort()) {
        const fullPath = join(directory, file);
        const stats = lstatSync(fullPath);
        const icon = stats.isDirectory() ? "📁" : "📄";
        console.log(`  ${icon} ${file}`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors du listage: ${error instanceof Error ? error.message : error}`);
    }
  }
}

function printHelp() {
  console.log(`
📁 File Manager CLI - Outil rapide de gestion de fichiers avec Bun

Usage: fmgr <commande> [options]

Commandes:
  copy <source> <destination>    Copier un fichier
  move <source> <destination>    Déplacer un fichier
  organize <directory> [pattern] Organiser les fichiers par extension
  list <directory>               Lister les fichiers
  help                           Afficher cette aide

Options:
  --recursive, -r               Mode récursif pour list
  --verbose, -v                 Mode verbose
  --pattern <pattern>           Filtrer par motif pour organize

Exemples:
  fmgr copy document.txt backup/document.txt
  fmgr move old-file.txt archive/
  fmgr organize ~/Downloads
  fmgr organize ~/Downloads --pattern ".pdf"
  fmgr list . --recursive
  `);
}

async function main() {
  const start = performance.now();
  
  try {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === "help") {
      printHelp();
      return;
    }

    const { values, positionals } = parseArgs({
      args,
      options: {
        recursive: { type: "boolean", short: "r" },
        verbose: { type: "boolean", short: "v" },
        pattern: { type: "string" }
      },
      allowPositionals: true
    });

    const command = positionals[0];
    const fileManager = new FileManager(values.verbose as boolean);

    switch (command) {
      case "copy":
        if (positionals.length < 3) {
          console.error("❌ Usage: fmgr copy <source> <destination>");
          process.exit(1);
        }
        await fileManager.copyFile(positionals[1], positionals[2]);
        break;

      case "move":
        if (positionals.length < 3) {
          console.error("❌ Usage: fmgr move <source> <destination>");
          process.exit(1);
        }
        await fileManager.moveFile(positionals[1], positionals[2]);
        break;

      case "organize":
        if (positionals.length < 2) {
          console.error("❌ Usage: fmgr organize <directory> [pattern]");
          process.exit(1);
        }
        await fileManager.organizeFiles(
          positionals[1], 
          values.pattern as string || positionals[2]
        );
        break;

      case "list":
        if (positionals.length < 2) {
          console.error("❌ Usage: fmgr list <directory>");
          process.exit(1);
        }
        await fileManager.listFiles(positionals[1], values.recursive as boolean);
        break;

      default:
        console.error(`❌ Commande inconnue: ${command}`);
        printHelp();
        process.exit(1);
    }

    const end = performance.now();
    if (values.verbose) {
      console.log(`⚡ Exécution terminée en ${(end - start).toFixed(2)}ms`);
    }

  } catch (error) {
    console.error(`❌ Erreur: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}