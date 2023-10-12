import axiosInstance from "@/lib/axios";
import { SurveyQuestions } from "../types";

export const createQuestion = async (data: {
  doctor_id: number;
  language: string;
  active: number;
  question: string;
}) => {
  return await axiosInstance
    .post("/chat/predefined-questions", data)
    .then((res) => res.data.questions);
};

export const getAllQuestions = async () => {
  return await axiosInstance
    .get<SurveyQuestions>("/chat/predefined-questions")
    .then((res) => Promise.resolve(res.data.questions));
};
export const deleteQuestion = async (data: { id: number }) => {
  return await axiosInstance
    .delete(`/chat/predefined-questions/${data.id}`)
    .then((res) => Promise.resolve(res.data.questions));
};
export const updateQuestion = async (data: {
  id: number;
  doctor_id: number;
  language: string;
  active: number;
  question: string;
}) => {
  return await axiosInstance
    .put(`/chat/predefined-questions/${data.id}`, data)
    .then((res) => Promise.resolve(res.data.questions));
};
