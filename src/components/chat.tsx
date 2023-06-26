import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import useChat from "~/hooks/useChat";
import { Card } from "./ui/card";
import { CardView } from "./card/flashCard/flashCardView";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

export interface ChatBubbleProps {
  question: string;
  answer: string;
  deckId: string;
}

const ChatBubble = ({ question, answer, deckId }: ChatBubbleProps) => {
  const openState = useState(true);
  const [saved, setSaved] = useState(false);
  const ctx = api.useContext();

  const { mutate, isLoading } = api.card.create.useMutation({
    onSuccess: () => {
      toast.success("added card");
      void ctx.deck.invalidate();
    },
    onError: () => {
      toast.error("failed to add card");
    },
  });

  const saveHandler = () => {
    setSaved(true);
    mutate({
      front: question,
      back: answer,
      deckId,
    });
  };

  return (
    <Card variant="glass">
      <CardView
        card={{ front: question, back: answer }}
        openState={openState}
      />

      {!!saved && (
        <Button
          className="mt-8"
          variant="primary"
          onClick={saveHandler}
          disabled={isLoading}
        >
          save to deck
        </Button>
      )}
    </Card>
  );
};

export interface Props {
  deckId: string;
  className?: string;
}

export const Chat = ({ deckId, className }: Props) => {
  const [question, setQuestion] = useState("");
  const { sendChat, history, isFetching } = useChat("flashcards", question);
  const sendHandler = () => {
    void sendChat().then(() => setQuestion(""));
  };

  return (
    <div className={className}>
      <div className="mb-4 space-y-4">
        {history.map(([q, a]) => (
          <ChatBubble
            key={deckId + q}
            question={q}
            answer={a}
            deckId={deckId}
          />
        ))}
      </div>

      <div className="flex space-x-4">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="w-full rounded-full border-2 border-slate-500 bg-slate-900/50 px-4 py-2 backdrop-blur-lg disabled:bg-slate-800 disabled:text-slate-500"
          placeholder="Ask me anything!"
          disabled={isFetching}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendHandler();
          }}
        />

        {isFetching}

        <Button variant="primary" onClick={sendHandler} disabled={isFetching}>
          <PaperPlaneIcon className="mr-2" /> Send
        </Button>
      </div>
    </div>
  );
};
