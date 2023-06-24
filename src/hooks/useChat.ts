import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const useChat = (deckId: string, question: string) => {
  const [history, setHistory] = useState<string[]>([]);
  const cardRecommendation = api.deck.chatWithSlides.useQuery(
    { deckId, question, history },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        console.log(data);
      },
      onError: () => {
        toast.error("failed to get recommendation");
      },
    }
  );

  return {
    sendChat: cardRecommendation.refetch,
    isFetching: cardRecommendation.isFetching,
  };
};

export default useChat;
