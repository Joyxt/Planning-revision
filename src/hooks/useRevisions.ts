import { useState, useEffect } from "react";
import { RevisionTask } from "@/types";

export function useRevisions() {
  const [revisions, setRevisions] = useState<Record<string, RevisionTask[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("planning-revisions");
    if (savedData) {
      try {
        setRevisions(JSON.parse(savedData));
      } catch (e) {
        console.error("Erreur de lecture des données locales", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("planning-revisions", JSON.stringify(revisions));
    }
  }, [revisions, isLoaded]);

  const addTask = (dateKey: string, task: Omit<RevisionTask, "id">) => {
    const newTask: RevisionTask = { ...task, id: crypto.randomUUID() };
    setRevisions((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTask],
    }));
  };

  // NOUVEAU : Fonction pour mettre à jour une tâche
  const updateTask = (dateKey: string, taskId: string, updatedData: Omit<RevisionTask, "id" | "completed">) => {
    setRevisions((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.map((t) =>
        t.id === taskId ? { ...t, ...updatedData } : t
      ) || [],
    }));
  };

  // NOUVEAU : Fonction pour supprimer une tâche
  const deleteTask = (dateKey: string, taskId: string) => {
    setRevisions((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((t) => t.id !== taskId) || [],
    }));
  };

  const toggleTaskStatus = (dateKey: string, taskId: string) => {
    setRevisions((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ) || [],
    }));
  };

  return { revisions, isLoaded, addTask, updateTask, deleteTask, toggleTaskStatus };
}