import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { RefObject, useState } from "react";
import { Button } from "~/components/ui/button";
import useChat from "~/hooks/useChat";
import { Card } from "./ui/card";
import { CardView } from "./card/flashCard/flashCardView";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { InputText } from "./ui/inputText";

export interface ChatBubbleProps {
  question: string;
  answer: string;
  moduleId: string;
}

const ChatBubble = ({ question, answer, moduleId }: ChatBubbleProps) => {
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
        isOpen={true}
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
  scrollRef: RefObject<HTMLDivElement>;
}

export const Chat = ({ moduleId, scrollRef }: Props) => {
  const [question, setQuestion] = useState("");
  const { sendChat, history, isFetching } = useChat(moduleId, question);
  const sendHandler = async () => {
    await sendChat();
    setQuestion("");

    setTimeout(() => {
      if (!scrollRef?.current) return;

      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 1);
  };

  return (
    <>
      <div className="flex h-full flex-col gap-4 pb-16">
        {history.map(([q, a]) => (
          <ChatBubble
            key={moduleId + q}
            question={q}
            answer={a}
            moduleId={moduleId}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <div className="container mx-auto flex gap-4 px-8 py-10 lg:px-16">
          <InputText
            value={question}
            fullWidth
            onChange={(event) => setQuestion(event.target.value)}
            className="w-full bg-slate-900/50 py-3 backdrop-blur-lg"
            placeholder="Ask me anything!"
            disabled={isFetching}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendHandler();
            }}
          />

          <Button variant="primary" onClick={sendHandler} disabled={isFetching}>
            <PaperPlaneIcon className="mr-2" /> Send
          </Button>
        </div>
      </div>
    </>
  );
};
