import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const useCardRecommendation = (deckId: string, front: string) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const cardRecommendation = api.card.getBackRecommendation.useQuery(
    { deckId, front },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        const message = data;

        setRecommendations([...recommendations, message]);
      },
      onError: () => {
        toast.error("failed to get recommendation");
      },
    }
  );

  return {
    getNewRecommendation: cardRecommendation.refetch,
    recommendations: recommendations,
    isFetching: cardRecommendation.isFetching,
  };
};

export default useCardRecommendation;
