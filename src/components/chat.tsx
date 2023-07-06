import { CardStackPlusIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
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
  moduleId: string;
}

const ChatBubble = ({ question, answer, moduleId }: ChatBubbleProps) => {
  const openState = useState(true);
  const [saved, setSaved] = useState(false);
  const ctx = api.useContext();

  const { mutateAsync, isLoading } = api.card.create.useMutation({
    onSuccess: () => void ctx.module.invalidate(),
  });

  const saveHandler = () => {
    setSaved(true);
    void toast.promise(
      mutateAsync({
        front: question,
        back: answer,
        moduleId,
      }),
      {
        loading: "Adding card",
        success: "Successfully added card",
        error: "Failed to add card",
      }
    );
  };

  return (
    <Card variant="glass" padding="none">
      <CardView
        card={{ front: question, back: answer }}
        openState={openState}
        className="p-4"
      />

      {!saved && (
        <div className="flex border-t-2 border-slate-500">
          <button
            className="flex w-full justify-center p-2 duration-500 hover:bg-slate-500"
            onClick={saveHandler}
            disabled={isLoading}
          >
            save as flashcard
          </button>
        </div>
      )}
    </Card>
  );
};

export interface Props {
  moduleId: string;
  className?: string;
}

export const Chat = ({ moduleId, className }: Props) => {
  const [question, setQuestion] = useState("");
  const { sendChat, history, isFetching } = useChat(moduleId, question);
  const sendHandler = () => {
    void sendChat().then(() => setQuestion(""));
  };

  return (
    <div className={className}>
      <div className="mb-4 space-y-4">
        {history.map(([q, a]) => (
          <ChatBubble
            key={moduleId + q}
            question={q}
            answer={a}
            moduleId={moduleId}
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
