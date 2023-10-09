import React from "react";
import { useQuery } from "react-query";

import { apiGetRecomandations } from "../api";
import { Recomandation, TreeNodeData } from "../types";
import { useSearchParams } from "react-router-dom";
import { useConversation } from ".";

export const useRecomandation = () => {
  const { data: analyses, isLoading: isAnalysesLoading } = useQuery<Recomandation>({
    queryKey: ["recomandation"],
    queryFn: async () => apiGetRecomandations(),
  });
  const { patientId, doctorId } = useConversation();
  const chat_id = patientId ?? doctorId;
  const [searchParams] = useSearchParams();
  const [typeConversetion, setTypeConversetion] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (searchParams.has("type")) {
      const type = searchParams.get("type") ?? null;
      type && setTypeConversetion(type);
    } else setTypeConversetion(null);
  }, [searchParams]);
  const treeData: TreeNodeData[] = [
    {
      title: "Favorite",
      value: "Favorite",
      key: "Favorite", // Adăugați o cheie unică aici
      children: analyses?.favorite.map((favoriteCategory, index) => ({
        title: favoriteCategory.name,
        value: "Favorite - " + index + " " + favoriteCategory.name + " id=" + favoriteCategory.id,
        key: "Favorite - " + index + " " + favoriteCategory.name + " id=" + favoriteCategory.id,
      })),
    },
    {
      title: "Categorii",
      value: "Categorii",
      key: "Categorii", // Adăugați o cheie unică aici
      children: analyses?.categories.map((category, index) => ({
        title: category.name,
        value: "Categorii - " + index + " " + category.name,
        key: "Categorii - " + index + " " + category.name,
        children: category.tests.map((test, indexTest) => ({
          title: test.name,
          value: "Categorii test - " + index + indexTest + " " + category.name + " id=" + test.id,
          key: "Categorii test - " + index + indexTest + " " + category.name + " id=" + test.id,
        })),
      })),
    },
  ];

  return React.useMemo(
    () => ({
      treeData,
      chat_id,
      isAnalysesLoading,
      typeConversetion,
    }),
    [treeData, chat_id, typeConversetion, isAnalysesLoading]
  );
};

export const extractIdsFromArray = (arrayOfStrings: string[]): number[] => {
  const regex = /id=(\d+)/;
  const ids: number[] = [];

  arrayOfStrings.forEach((inputString) => {
    const match = inputString.match(regex);

    if (match) {
      const id = parseInt(match[1], 10);
      ids.push(id);
    }
  });

  return ids;
};
