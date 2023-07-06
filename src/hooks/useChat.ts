import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

const useChat = (moduleId: string, question: string) => {
  const [history, setHistory] = useState<[string, string][]>([]);
  const cardRecommendation = api.chat.chatWithModule.useQuery(
    { moduleId, question, history },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      onSuccess: (data) => {
        setHistory([...history, [question, data.text]]);
        console.log(data);
      },
      onError: () => {
        toast.error("failed to get recommendation");
      },
    }
  );

  return {
    sendChat: cardRecommendation.refetch,
    history,
    isFetching: cardRecommendation.isFetching,
  };
};

export default useChat;
