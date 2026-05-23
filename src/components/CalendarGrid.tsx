"use client";

import { useEffect, useState } from "react";
import { getCalendarDates } from "@/lib/dateUtils";
import DayCard from "./DayCard";
import TaskModal from "./TaskModal";
import ThemeToggle from "./ThemeToggle";
import ProgressBar from "./ProgressBar";
import { useRevisions } from "@/hooks/useRevisions";
import { format, differenceInDays, startOfDay } from "date-fns";
import { LayoutGrid, Maximize2 } from "lucide-react";
import { RevisionTask } from "@/types";

export default function CalendarGrid() {
  const [dates, setDates] = useState<Date[]>([]);
  const [isCalendarMounted, setIsCalendarMounted] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<RevisionTask | null>(null);

  const { revisions, isLoaded, addTask, updateTask, deleteTask, toggleTaskStatus } = useRevisions();

  useEffect(() => {
    setDates(getCalendarDates());
    setIsCalendarMounted(true);
  }, []);

  if (!isCalendarMounted || !isLoaded) {
    return (
      <div className="text-center text-[36px] text-brand-gray dark:text-slate-400 mt-20 animate-pulse">
        Chargement du calendrier...
      </div>
    );
  }

  const handleOpenModal = (date: Date, task?: RevisionTask) => {
    setSelectedDate(date);
    setTaskToEdit(task || null);
    setIsModalOpen(true);
  };

  // NOUVEAU : Accepte un tableau de plusieurs tâches créées depuis les cases à cocher
  const handleSaveTask = (tasksData: { subject: string; startTime: string; endTime: string; note?: string }[], taskId?: string) => {
    if (selectedDate) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      // Si on modifie une tâche existante (1 seule)
      if (taskId && tasksData.length === 1) {
        updateTask(dateKey, taskId, tasksData[0]);
      } else {
        // Si on crée plusieurs tâches d'un coup
        tasksData.forEach(task => {
          addTask(dateKey, { ...task, completed: false });
        });
      }
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (selectedDate) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      deleteTask(dateKey, taskId);
    }
  };

  const targetExamDate = new Date(2026, 5, 10); 
  const daysLeft = differenceInDays(targetExamDate, startOfDay(new Date()));
  const countdownText = daysLeft > 0 ? `J - ${daysLeft}` : daysLeft === 0 ? "Jour J !" : "Examen passé";

  const allTasks = Object.values(revisions).flat();
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.completed).length;

  return (
    <div className="w-full max-w-[1800px] mx-auto pb-20">
      
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-6 mt-4 bg-white/40 dark:bg-slate-800/40 p-4 rounded-3xl border border-white/60 dark:border-slate-700/60 backdrop-blur-sm shadow-sm transition-colors">
        
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark dark:text-white drop-shadow-sm">
            Planning de Révisions 🚀
          </h1>
          <div className="text-xl sm:text-2xl font-extrabold text-white bg-orange-500 px-5 py-2.5 rounded-2xl shadow-md border-2 border-orange-400 transform rotate-[-2deg] hover:rotate-0 transition-transform cursor-default">
            {countdownText}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex gap-2 bg-brand-light dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <button
              onClick={() => setIsCompact(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isCompact 
                  ? "bg-brand-violet text-white shadow-md" 
                  : "text-brand-gray dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700"
              }`}
            >
              <LayoutGrid size={18} />
              Vue Globale
            </button>
            <button
              onClick={() => setIsCompact(false)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                !isCompact 
                  ? "bg-brand-violet text-white shadow-md" 
                  : "text-brand-gray dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700"
              }`}
            >
              <Maximize2 size={18} />
              Vue Détaillée
            </button>
          </div>
        </div>
      </div>

      <ProgressBar total={totalTasks} completed={completedTasks} />

      <div className={`grid gap-6 ${
        isCompact 
          ? "grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7" 
          : "grid-cols-1 md:grid-cols-2 2xl:grid-cols-3" 
      }`}>
        {dates.map((date, index) => {
          const dateKey = format(date, "yyyy-MM-dd");
          const dayTasks = revisions[dateKey] || [];
          
          return (
            <DayCard 
              key={dateKey} 
              date={date} 
              dateKey={dateKey}
              tasks={dayTasks}
              isCompact={isCompact} 
              index={index} 
              onAddClick={() => handleOpenModal(date)}
              onEditTask={(task) => handleOpenModal(date, task)} 
              onToggleTask={(taskId) => toggleTaskStatus(dateKey, taskId)}
            />
          );
        })}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask} 
        date={selectedDate}
        taskToEdit={taskToEdit} 
      />
    </div>
  );
}