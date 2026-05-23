export interface RevisionTask {
  id: string;          // Identifiant unique
  subject: string;     // Matière (ex: "Mathématiques")
  startTime: string;   // Heure de début "HH:mm"
  endTime: string;     // Heure de fin "HH:mm"
  note?: string;       // Facultatif
  completed: boolean;  // Tâche finie ou non
}