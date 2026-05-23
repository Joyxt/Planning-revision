"use client";

import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import { fr } from "date-fns/locale";
import { RevisionTask } from "@/types";
import { Plus, Check, Pencil } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface DayCardProps {
  date: Date;
  dateKey: string;
  tasks: RevisionTask[];
  isCompact: boolean;
  index: number;
  onAddClick: () => void;
  onEditTask: (task: RevisionTask) => void;
  onToggleTask: (taskId: string) => void;
}

const EXAM_DATES: Record<string, string> = {
  "2026-06-10": "ORAL",
  "2026-06-26": "Épreuve de français (matin) et épreuve de mathématiques (après-midi).",
  "2026-06-29": "Histoire-géographie et enseignement moral et civique (matin) ainsi que Sciences (après-midi).",
  "2026-06-30": "la langue vivante étrangère"
};

const ENCOURAGEMENT_MESSAGES = [
  "Excellent travail 👏",
  "Continue comme ça 🔥",
  "Tu progresses chaque jour 🚀",
  "Super session ! 🧠",
  "Objectif atteint 🎯",
  "T'es pas un ZIZI ! 😎",
  "T'es le Boss ! 👑",
  "Okay t'es pas un guégaine ! 😁",
  "mange lui la ratte au BEPC ! 🍽️"
];

// --- NOUVEAU : Fonction qui attribue le Badge selon le nombre de révisions ---
const getTaskBadge = (count: number) => {
  if (count === 1) return "🌱"; // 1 : Bon départ
  if (count === 2) return "🥉"; // 2 : Sérieux
  if (count === 3) return "🥈"; // 3 : Solide
  if (count === 4) return "🥇"; // 4 : Champion
  if (count === 5) return "👑"; // 5 : Le Boss
  if (count >= 6) return "🏆"; // 6+ : Légende absolue
  return null;
};

// Fonction qui attribue les couleurs par matière
const getSubjectStyles = (subject: string, completed: boolean) => {
  if (completed) {
    return "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600 text-green-700 dark:text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:shadow-[0_0_15px_rgba(34,197,94,0.15)]";
  }

  const lowerSubject = subject.toLowerCase();

  if (lowerSubject.includes("math") || lowerSubject.includes("géométrie") || lowerSubject.includes("geometrie") || lowerSubject.includes("algèbre")) {
    return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:border-blue-400 dark:hover:border-blue-500";
  }
  if (lowerSubject.includes("français") || lowerSubject.includes("francais") || lowerSubject.includes("grammaire") || lowerSubject.includes("orthographe") || lowerSubject.includes("lecture")) {
    return "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:border-rose-400 dark:hover:border-rose-500";
  }
  if (lowerSubject.includes("histoire") || lowerSubject.includes("géo") || lowerSubject.includes("geo") || lowerSubject.includes("emc")) {
    return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-400 hover:border-amber-400 dark:hover:border-amber-500";
  }
  if (lowerSubject.includes("svt") || lowerSubject.includes("physique") || lowerSubject.includes("chimie") || lowerSubject.includes("techno") || lowerSubject.includes("science")) {
    return "bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-200 dark:border-fuchsia-800 text-fuchsia-800 dark:text-fuchsia-300 hover:border-fuchsia-400 dark:hover:border-fuchsia-500";
  }
  if (lowerSubject.includes("anglais") || lowerSubject.includes("espagnol") || lowerSubject.includes("allemand") || lowerSubject.includes("langue")) {
    return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-400 hover:border-emerald-400 dark:hover:border-emerald-500";
  }
  
  return "bg-brand-light dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-brand-violet/30 dark:hover:border-brand-violet/50";
};

export default function DayCard({ date, dateKey, tasks, isCompact, index, onAddClick, onEditTask, onToggleTask }: DayCardProps) {
  const isDateToday = isToday(date);
  const isDatePast = isPast(date) && !isDateToday;
  const examText = EXAM_DATES[dateKey];
  const isExamDate = !!examText;
  const hasRevisions = tasks.length > 0; 
  const taskCount = tasks.length; // Nombre de matières prévues aujourd'hui

  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  let emptyEmoji = "🙂"; 
  let emptyTooltip = "Journée libre !";
  
  if (isDatePast || isDateToday) {
    emptyEmoji = "🥺"; 
    emptyTooltip = "Aucune révision...";
  }

  const handleTaskClick = (task: RevisionTask, e: React.MouseEvent) => {
    if (!task.completed) {
      const cardElement = e.currentTarget.closest('.group');
      let originX = 0.5;
      let originY = 0.5;

      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        originX = (rect.left + rect.width / 2) / window.innerWidth;
        originY = (rect.top + rect.height / 2) / window.innerHeight;
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { x: originX, y: originY },
        zIndex: 100,
        colors: ['#6D28D9', '#10B981', '#F59E0B', '#3B82F6']
      });

      const randomMsg = ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
      setPopupMessage(randomMsg);

      setTimeout(() => {
        setPopupMessage(null);
      }, 2500);
    }

    onToggleTask(task.id);
  };

  const handleEditClick = (e: React.MouseEvent, task: RevisionTask) => {
    e.stopPropagation(); 
    onEditTask(task);
  };

  const layoutClass = isCompact 
    ? "min-h-[140px] p-3 rounded-2xl border-2" 
    : "aspect-video p-6 sm:p-8 rounded-[2rem] border-[3px]";

  const dayTextSize = isCompact ? "text-sm" : "text-[42px]";
  const dateTextSize = isCompact ? "text-sm" : "text-[42px]";
  const examTextSize = isCompact ? "text-sm md:text-base" : "text-[32px] md:text-[38px]"; 
  const emojiSize = isCompact ? "text-3xl" : "text-[90px]";
  const taskTitleSize = isCompact ? "text-xs" : "text-[36px]";
  const taskTimeSize = isCompact ? "text-[10px]" : "text-[30px]";
  const taskNoteSize = isCompact ? "text-[10px]" : "text-[28px]";
  const taskPadding = isCompact ? "p-2 rounded-lg border" : "p-4 rounded-[1.5rem] border-[2px]";
  const checkboxSize = isCompact ? "w-4 h-4 mt-0.5 ml-2 border" : "mt-2 w-12 h-12 border-[3px]";
  const checkIconSize = isCompact ? 10 : 32;
  const pencilIconSize = isCompact ? 14 : 32; 
  const plusButtonSize = isCompact ? "p-2 bottom-2 right-2" : "p-4 bottom-6 right-6";
  const plusIconSize = isCompact ? 16 : 40;
  const plusStroke = isCompact ? 2 : 3;

  let cardBg = isCompact 
    ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-violet/50 dark:hover:border-brand-violet/50"
    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-brand-violet/50 dark:hover:border-brand-violet/50";

  if (isExamDate) {
    cardBg = isCompact 
      ? "bg-orange-100 dark:bg-orange-950/40 border-orange-400 dark:border-orange-800 shadow-sm" 
      : "bg-orange-100 dark:bg-orange-950/40 border-orange-400 dark:border-orange-800 shadow-md";
  } else if (isDatePast) {
    cardBg = isCompact 
      ? "bg-brand-gray/10 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-60" 
      : "bg-brand-gray/10 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-60";
  } else if (isDateToday) {
    cardBg = isCompact 
      ? "bg-white dark:bg-slate-800 border-brand-violet ring-4 ring-brand-violet/20 shadow-md transform scale-[1.02] z-10"
      : "bg-white dark:bg-slate-800 border-brand-violet ring-8 ring-brand-violet/20 shadow-2xl transform scale-[1.02] z-10";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.85 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 800, 
        damping: 18,    
        mass: 0.4,      
        delay: index * 0.05 // Ta cascade custom !
      }}
      className={`group flex flex-col relative overflow-hidden transition-all duration-300 ${layoutClass} ${cardBg}`}
    >
      
      <div className={`flex justify-between items-center ${isCompact ? "mb-3" : "mb-6"}`}>
        {/* Conteneur pour le nom du jour + le badge ! */}
        <div className="flex items-center gap-2 md:gap-3">
          <span className={`font-semibold capitalize leading-none ${dayTextSize} ${
              isDateToday && !isExamDate ? "text-brand-violet dark:text-brand-violet" : (isExamDate ? "text-orange-700 dark:text-orange-400" : "text-brand-gray dark:text-slate-300")
            }`}
          >
            {format(date, "EEEE", { locale: fr })}
          </span>
          
          {/* Le fameux badge ! */}
          {!isExamDate && hasRevisions && (
            <span 
              className={`drop-shadow-sm transition-transform hover:scale-125 hover:-rotate-6 cursor-help ${isCompact ? "text-base" : "text-[32px]"}`}
              title={`${taskCount} matière(s) au programme !`}
            >
              {getTaskBadge(taskCount)}
            </span>
          )}
        </div>

        <span className={`leading-none ${dateTextSize} ${
            isDateToday && !isExamDate ? "font-bold text-brand-violet dark:text-brand-violet" : (isExamDate ? "font-bold text-orange-800 dark:text-orange-300" : "text-slate-500 dark:text-slate-400")
          }`}
        >
          {format(date, "d MMM", { locale: fr })}
        </span>
      </div>

      <div className={`flex-1 flex flex-col overflow-y-auto pr-1 ${isCompact ? "gap-2 pb-1" : "gap-4 pb-2"}`}>
        {isExamDate ? (
          <div className="flex-1 flex items-center justify-center">
            <p className={`font-bold text-orange-900 dark:text-orange-300 text-center leading-snug ${examTextSize}`}>
              {examText}
            </p>
          </div>
        ) : !hasRevisions ? (
          <div className="flex-1 flex items-center justify-center">
            <span className={`opacity-40 hover:opacity-100 transition-opacity cursor-default ${emojiSize}`} title={emptyTooltip}>
              {emptyEmoji}
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={(e) => handleTaskClick(task, e)}
              className={`group/task flex justify-between items-start cursor-pointer transition-all duration-500 ${taskPadding} ${getSubjectStyles(task.subject, !!task.completed)}`}
            >
              <div className="flex flex-col flex-1 pr-2">
                <p className={`font-semibold leading-tight transition-all duration-500 ${taskTitleSize} ${task.completed ? "line-through opacity-70" : ""}`}>
                  {task.subject}
                </p>
                <p className={`opacity-75 mt-1 font-medium leading-tight ${taskTimeSize}`}>
                  {task.startTime} — {task.endTime}
                </p>
                {task.note && !task.completed && (
                  <p className={`mt-1 opacity-75 italic truncate max-w-[90%] leading-tight ${taskNoteSize}`}>
                    {task.note}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={(e) => handleEditClick(e, task)}
                  className={`opacity-100 md:opacity-0 group-hover/task:opacity-100 transition-opacity text-current opacity-50 hover:opacity-100 ${isCompact ? "p-1" : "p-2"}`}
                  title="Modifier la révision"
                >
                  <Pencil size={pencilIconSize} />
                </button>

                <div className={`rounded-full flex flex-shrink-0 items-center justify-center transition-colors duration-300 ${checkboxSize} ${
                  task.completed ? "bg-green-500 border-green-500 shadow-sm" : "bg-white dark:bg-slate-800/50 border-current opacity-40"
                }`}>
                  {task.completed && <Check size={checkIconSize} strokeWidth={isCompact ? 3 : 4} className="text-white" />}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {!isDatePast && !isExamDate && (
        <button
          onClick={onAddClick}
          className={`absolute bg-brand-violet text-white rounded-full shadow-lg hover:bg-brand-violet/90 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10 ${plusButtonSize}`}
          title="Ajouter une révision"
        >
          <Plus size={plusIconSize} strokeWidth={plusStroke} />
        </button>
      )}

      <AnimatePresence>
        {popupMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-inherit"
          >
            <div className={`bg-brand-violet text-white shadow-xl font-bold text-center ${
              isCompact ? "px-4 py-2 text-sm rounded-xl" : "px-8 py-4 text-3xl md:text-[36px] rounded-[2rem]"
            }`}>
              {popupMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}