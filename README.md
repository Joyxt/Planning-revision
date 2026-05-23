# Planning de Révisions - Objectif Brevet 🚀🎓

Une application web sur-mesure, interactive et motivante pour organiser ses révisions jusqu'au jour J. Développée avec **Next.js**, **Tailwind CSS v4** et **Framer Motion**.

---

## ✨ Fonctionnalités Principales

Cette application a été pensée pour maximiser la productivité tout en récompensant l'effort grâce à la gamification.

* 🌙 **Mode Sombre & Clair :** Un bouton dédié permet de basculer instantanément dans un mode nuit élégant, idéal pour reposer les yeux lors des révisions tardives.
* 🏆 **Système de Badges Évolutifs :** L'application récompense tes grosses journées. Plus tu révises de matières dans une même journée, plus ton badge évolue :
    * 1 matière = 🌱 *(Un bon départ)*
    * 2 matières = 🥉 *(On devient sérieux)*
    * 3 matières = 🥈 *(Très solide)*
    * 4 matières = 🥇 *(Champion des révisions)*
    * 5 matières = 👑 *(Le Boss du planning)*
    * 6 matières et + = 🏆 *(Légende absolue)*
* 🌈 **Couleurs Automatiques par Matière :** En cochant les matières (Maths, Français, Histoire, etc.), l'application génère automatiquement des blocs avec des codes couleurs spécifiques pour une lisibilité instantanée du planning.
* 📊 **Suivi de Progression :** Une jauge globale calcule automatiquement ton pourcentage de réussite par rapport à l'ensemble des tâches prévues.
* 🎉 **Célébration :** Chaque tâche accomplie déclenche une explosion de confettis et un message d'encouragement aléatoire ("T'es le Boss !", "Excellent travail 👏","T'es pas un ZiZi").
* 💾 **Sauvegarde Locale :** Pas besoin de compte ! Toutes les données sont sauvegardées de manière ultra-rapide et sécurisée directement dans ton navigateur (`localStorage`).ATTENTION ne pas vider le cache pour ne pas tout perdre.

---

## 📖 Tutoriel : Comment utiliser l'application ?

L'interface est conçue pour être la plus intuitive possible.

### 1. Ajouter des révisions
1. Survole une journée dans le calendrier et clique sur le bouton violet **`+`** qui apparaît en bas à droite de la carte.
2. Une fenêtre s'ouvre : clique sur les **matières** que tu souhaites réviser ce jour-là (ex: Maths et Français).
3. Pour chaque matière sélectionnée, un petit formulaire glisse vers le bas. Renseigne **l'heure de début**, **l'heure de fin** et ajoute une éventuelle note (ex: "Chapitre 3", "Exercices p.42").
4. Clique sur **Enregistrer**. Tes révisions apparaissent instantanément avec leurs belles couleurs !

### 2. Valider une tâche (et fêter ça !)
* Une fois ta session de révision terminée, clique simplement n'importe où sur le bloc de la matière.
* La tâche se colore en vert, les confettis explosent, la barre de progression globale avance, et le texte se barre. Bravo !

### 3. Modifier ou Supprimer une révision
* Survole la tâche que tu souhaites modifier.
* Clique sur la petite icône de **Crayon** ✏️ qui apparaît à droite.
* Modifie tes horaires ou ta note, puis clique sur "Mettre à jour".
* Pour la supprimer, clique sur le bouton rouge **Supprimer** (il te demandera confirmation pour éviter les erreurs).

### 4. Changer de vue
Utilise les boutons en haut de l'écran pour basculer entre :
* **Vue Globale :** Pour voir tout ton mois d'un seul coup d'œil (les cartes sont petites, parfait pour avoir une vision d'ensemble).
* **Vue Détaillée :** Pour voir tes journées en grand avec tout le détail de tes notes.

---

## ⏱️ Routine de base de l'étudiant (Conseillée)

Avoir un bon outil ne fait pas tout, il faut aussi une bonne méthode ! Voici une routine classique et efficace à appliquer avec ce planning pour tout casser au brevet :

### En Semaine (Après les cours)
* **17h30 - 18h00 : Décompression.** Goûter, repos absolu, on ne pense pas au collège.
* **18h00 - 18h45 : Bloc de révision 1.** (Ex: Revoir le cours de la journée / Devoirs à faire pour le lendemain).
* **18h45 - 19h00 : Pause.** On s'étire, on boit de l'eau, on écoute un son.
* **19h00 - 19h45 : Bloc de révision 2.** (Ex: Matière ciblée pour le brevet, Fiches de révisions, QCM).
* **19h45 :** On valide les tâches sur l'application (Confettis ! 🎉) et on coupe tout pour la soirée.

### Le Week-end (Le mode "Or 🥇")
* **Samedi matin (10h - 12h) :** Faire le point sur les matières faibles. Créer des fiches.
* **Dimanche soir (18h - 19h) :** Le moment le plus important ! Ouvre cette application et **planifie ta semaine complète à l'avance**. Choisis tes matières et crée tes blocs. Une semaine planifiée est une semaine à moitié réussie !

---

## 🛠️ Stack Technique
* **Framework :** Next.js (React)
* **Styling :** Tailwind CSS v4
* **Animations :** Framer Motion & Canvas Confetti
* **Gestion des dates :** date-fns
* **Icônes :** Lucide React
