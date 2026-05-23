"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  total: number;
  completed: number;
}

export default function ProgressBar({ total, completed }: ProgressBarProps) {
  // Calcul du pourcentage (on évite la division par zéro)
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full bg-white/60 dark:bg-slate-800/40 p-5 rounded-3xl border border-white/60 dark:border-slate-700/60 backdrop-blur-sm shadow-sm transition-colors mb-8">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-brand-dark dark:text-white flex items-center gap-2">
            Progression globale 📈
          </h3>
          <p className="text-sm font-medium text-brand-gray dark:text-slate-400 mt-1">
            {completed} sur {total} session{total > 1 ? "s" : ""} terminée{completed > 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-3xl font-black text-brand-violet dark:text-brand-violet drop-shadow-sm">
          {percentage}%
        </div>
      </div>
      
      {/* Fond de la barre */}
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
        {/* Remplissage animé */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="h-full bg-brand-violet relative"
        >
          {/* Petit reflet stylé sur la jauge pour l'effet "Jeu vidéo" */}
          <div className="absolute inset-0 bg-white/20 dark:bg-white/10 w-full h-1/2" />
        </motion.div>
      </div>
    </div>
  );
}