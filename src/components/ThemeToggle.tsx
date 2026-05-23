"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // Évite l'erreur d'hydratation (ne rend le bouton que côté client)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Bouton fantôme le temps du chargement
    return <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-light dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-brand-gray dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors shadow-sm overflow-hidden"
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      <motion.div
        initial={false}
        animate={{
          y: isDark ? 30 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <Sun size={20} />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          y: isDark ? 0 : -30,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute"
      >
        <Moon size={20} />
      </motion.div>
    </button>
  );
}