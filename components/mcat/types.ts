export type McatSection = "C/P" | "CARS" | "B/B" | "P/S";

export type SectionScores = Record<McatSection, number>;

export type StudyTaskCategory =
  | "Content Review"
  | "CARS Practice"
  | "FL Review"
  | "Anki Review"
  | "Rest Day";

export type StudyTask = {
  id: string;
  date: string;
  title: string;
  category: StudyTaskCategory;
  completed: boolean;
};
