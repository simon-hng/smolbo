import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const useCardRecommendation = (deckId: string, front: string) => {
  const [index, setIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const cardRecommendation = api.card.getBackRecommendation.useQuery(
    { deckId, front },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        const message = data;

        setRecommendations([message, ...recommendations]);
      },
      onError: () => {
        toast.error("failed to get recommendation");
      },
    }
  );

  const nextRecommendation = () => {
    let next = index - 1;
    if (next < 0) {
      next = recommendations.length - 1;
    }
    setIndex(next);
    return recommendations[next];
  };

  const prevRecommendation = () => {
    let prev = index + 1;
    if (prev >= recommendations.length) {
      prev = 0;
    }
    setIndex(prev);
    return recommendations[prev];
  };

  return {
    getNewRecommendation: cardRecommendation.refetch,
    recommendation: recommendations[index],
    nextRecommendation,
    prevRecommendation,
    isFetching: cardRecommendation.isFetching,
  };
};

export default useCardRecommendation;
