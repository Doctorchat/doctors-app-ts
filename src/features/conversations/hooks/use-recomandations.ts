import React from "react";
import { useSearchParams } from "react-router-dom";

import { useQuery } from "react-query";

import {  apiGetRecomandations} from "../api";
import { Recomandation, TreeNodeData } from "../types";

export const useRecomandation = () => {
  const { data: analyses, isLoading: isAnalysesLoading } = useQuery<Recomandation>({
    queryKey: ["recomandation"],
    queryFn: async () => apiGetRecomandations(),
  });
  const treeData: TreeNodeData[] = [
    {
      title: "Favorite",
      value: "Favorite",
      children: analyses?.favorite.map((favoriteCategory, index) => ({
        title: favoriteCategory.name,
        value: "Favorite - " + index + " " + favoriteCategory.name,
        key: "Favorite - " + index + favoriteCategory.name,
        children: favoriteCategory.tests.map((test, testIndex) => ({
          title: test.name,
          value: "Favorite - " + index + testIndex + " " + favoriteCategory.name,
          key: "Favorite - " + index + testIndex + favoriteCategory.name,
        })),
      })),
    },
    {
      title: "Categorii",
      value: "Categorii",
      children: analyses?.categories.map((category, index) => ({
        title: category.name,
        value: "Categorii - " + index + " " + category.name,
        key: "Categorii - " + index + category.name,
        children: category.tests.map((test, indexTest) => ({
          title: test.name,
          value: "Categorii test - " + index + indexTest + " " + category.name,
          key: "Categorii test - " + index + indexTest + category.name,
        })),
      })),
    },
  ];
  return React.useMemo(
    () => ({
      treeData,
      isAnalysesLoading,
    }),
    [treeData, isAnalysesLoading]
  );
};
