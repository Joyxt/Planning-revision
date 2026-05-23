"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { X, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RevisionTask } from "@/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tasks: { subject: string; startTime: string; endTime: string; note?: string }[], taskId?: string) => void;
  onDelete?: (taskId: string) => void; 
  date: Date | null;
  taskToEdit?: RevisionTask | null; 
}

// Notre belle liste prédéfinie
const PREDEFINED_SUBJECTS = [
  { id: "Mathématiques", icon: "📐" },
  { id: "Français", icon: "📚" },
  { id: "Histoire-Géo / EMC", icon: "🌍" },
  { id: "Sciences", icon: "🧪" },
  { id: "Langues", icon: "🗣️" },
  { id: "Autre", icon: "🎨" }
];

export default function TaskModal({ isOpen, onClose, onSave, onDelete, date, taskToEdit }: TaskModalProps) {
  // Liste des matières cochées
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  // Dictionnaire qui stocke l'heure et la note pour chaque matière cochée
  const [taskDetails, setTaskDetails] = useState<Record<string, { startTime: string, endTime: string, note: string }>>({});
  
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        // Si on édite, on pré-coche la bonne matière
        setSelectedSubjects([taskToEdit.subject]);
        setTaskDetails({
          [taskToEdit.subject]: { 
            startTime: taskToEdit.startTime, 
            endTime: taskToEdit.endTime, 
            note: taskToEdit.note || "" 
          }
        });
      } else {
        // Formulaire vierge
        setSelectedSubjects([]);
        setTaskDetails({});
      }
      setIsConfirmingDelete(false);
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen || !date) return null;

  // Gère le clic sur une case matière
  const handleSubjectToggle = (subjectId: string) => {
    if (isEditing) {
      // En mode édition, on ne permet de cocher qu'une seule matière à la fois
      setSelectedSubjects([subjectId]);
      const currentDetails = Object.values(taskDetails)[0] || { startTime: "17:00", endTime: "18:00", note: "" };
      setTaskDetails({ [subjectId]: currentDetails });
    } else {
      // En mode création, on ajoute ou enlève la case cochée
      if (selectedSubjects.includes(subjectId)) {
        setSelectedSubjects(prev => prev.filter(s => s !== subjectId));
      } else {
        setSelectedSubjects(prev => [...prev, subjectId]);
        // On initialise ses horaires par défaut
        setTaskDetails(prev => ({
          ...prev,
          [subjectId]: { startTime: "17:00", endTime: "18:00", note: "" }
        }));
      }
    }
  };

  // Gère la modification de l'heure ou de la note pour un bloc précis
  const updateDetail = (subjectId: string, field: "startTime" | "endTime" | "note", value: string) => {
    setTaskDetails(prev => ({
      ...prev,
      [subjectId]: { ...prev[subjectId], [field]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) return;
    
    // On rassemble tous les blocs pour les sauvegarder d'un coup
    const tasksToSave = selectedSubjects.map(subId => ({
      subject: subId,
      startTime: taskDetails[subId].startTime,
      endTime: taskDetails[subId].endTime,
      note: taskDetails[subId].note
    }));
    
    onSave(tasksToSave, taskToEdit?.id);
    onClose();
  };

  const handleDeleteClick = () => {
    if (isConfirmingDelete && taskToEdit && onDelete) {
      onDelete(taskToEdit.id);
      onClose();
    } else {
      setIsConfirmingDelete(true);
      setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-dark/40 dark:bg-black/60 backdrop-blur-sm transition-colors"
        />

        {/* Le conteneur s'adapte en hauteur pour laisser la place aux multiples blocs */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors flex flex-col max-h-[90vh]"
        >
          {/* Header Fixe */}
          <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-700 bg-brand-light/50 dark:bg-slate-800/50 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-brand-dark dark:text-white">
                {isEditing ? "Modifier la révision" : "Planifier des révisions"}
              </h2>
              <p className="text-sm text-brand-gray dark:text-slate-400 capitalize">
                {format(date, "EEEE d MMMM yyyy", { locale: fr })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-brand-gray dark:text-slate-400 hover:text-brand-dark dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Corps avec Ascenseur (si beaucoup de matières) */}
          <div className="overflow-y-auto p-5 flex-1 custom-scrollbar">
            
            {/* 1. ÉTAPE : COCHER LES MATIÈRES */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-brand-dark dark:text-slate-200 mb-3">
                1. Sélectionne les matières à réviser
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PREDEFINED_SUBJECTS.map(sub => {
                  const isSelected = selectedSubjects.includes(sub.id);
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => handleSubjectToggle(sub.id)}
                      className={`p-3 rounded-xl text-sm font-medium border text-left transition-all hover:scale-[1.02] active:scale-95 ${
                        isSelected 
                          ? "border-brand-violet bg-brand-violet/10 text-brand-violet dark:border-brand-violet/50 dark:bg-brand-violet/20 dark:text-brand-violet shadow-sm" 
                          : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{sub.icon}</span>
                        {/* La case à cocher visuelle */}
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-brand-violet border-brand-violet' : 'border border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected && <Check size={14} className="text-white" strokeWidth={4} />}
                        </div>
                      </div>
                      <span className="block truncate font-bold">{sub.id}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. ÉTAPE : CONFIGURER LES BLOCS SÉLECTIONNÉS */}
            {selectedSubjects.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-brand-dark dark:text-slate-200 mb-2">
                  2. Détails des horaires
                </label>
                
                <AnimatePresence>
                  {selectedSubjects.map(subId => {
                    const subDef = PREDEFINED_SUBJECTS.find(s => s.id === subId);
                    const details = taskDetails[subId];
                    if (!details) return null;

                    return (
                      <motion.div 
                        key={subId}
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                      >
                        <h4 className="font-bold text-brand-dark dark:text-white mb-3 flex items-center gap-2">
                          <span>{subDef?.icon}</span> {subId}
                        </h4>
                        
                        <div className="flex gap-4 mb-3">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-brand-gray dark:text-slate-400 mb-1">Début</label>
                            <input
                              type="time"
                              value={details.startTime}
                              onChange={(e) => updateDetail(subId, "startTime", e.target.value)}
                              required
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/50 dark:[color-scheme:dark]"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-brand-gray dark:text-slate-400 mb-1">Fin</label>
                            <input
                              type="time"
                              value={details.endTime}
                              onChange={(e) => updateDetail(subId, "endTime", e.target.value)}
                              required
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/50 dark:[color-scheme:dark]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-brand-gray dark:text-slate-400 mb-1">Note (optionnelle)</label>
                          <textarea
                            value={details.note}
                            onChange={(e) => updateDetail(subId, "note", e.target.value)}
                            placeholder="Exercices, chapitre..."
                            rows={1}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/50 resize-none"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer Fixe */}
          <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex justify-between items-center gap-3">
            <div className="flex-1">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                    isConfirmingDelete 
                      ? "bg-red-500 text-white shadow-md hover:bg-red-600" 
                      : "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
                  }`}
                >
                  <Trash2 size={16} />
                  {isConfirmingDelete ? "Sûr ?" : "Supprimer"}
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-brand-gray dark:text-slate-300 hover:text-brand-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedSubjects.length === 0}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-violet hover:bg-brand-violet/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
              >
                {isEditing ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}