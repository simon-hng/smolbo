import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import useChat from "~/hooks/useChat";
import { Card } from "./ui/card";
import { CardView } from "./card/flashCard/flashCardView";

export interface ChatBubbleProps {
  question: string;
  answer: string;
}

const ChatBubble = ({ question, answer }: ChatBubbleProps) => {
  const openState = useState(true);

  return (
    <Card>
      <CardView
        card={{ front: question, back: answer }}
        openState={openState}
      />
    </Card>
  );
};

export interface Props {
  deckId: string;
  className?: string;
}

export const Chat = ({ deckId, className }: Props) => {
  const [question, setQuestion] = useState("");
  const { sendChat, history } = useChat("flashcards", question);

  return (
    <div className={className}>
      <div className="mb-4 space-y-4">
        {history.map(([q, a]) => (
          <>
            <ChatBubble question={q} answer={a} />
          </>
        ))}
      </div>

      <div className="flex space-x-4">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="w-full rounded-full border-2 border-slate-500 bg-slate-900/50 px-4 py-2 backdrop-blur-lg"
          placeholder="Ask me anything!"
        />

        <Button
          className="bg-slate-900/50 backdrop-blur-lg"
          onClick={() => void sendChat()}
        >
          <PaperPlaneIcon className="mr-2" /> Send
        </Button>
      </div>
    </div>
  );
};
