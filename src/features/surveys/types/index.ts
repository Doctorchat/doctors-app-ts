export interface SurveyQuestions {
  questions: IQuestions[];
}
interface IQuestions {
  active: number;
  created_at: string;
  doctor_id: number;
  id: number;
  language: "ru" | "ro" | "en";
  question: string;
  updated_at: string;
}
