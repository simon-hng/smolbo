import type { Card } from "@prisma/client";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export interface Props {
  card: Card;
  className?: string;
}

export const CardChat = ({ card, className }: Props) => {
  const [question, setQuestion] = useState("");

  return (
    <div className={className}>
      <div className="flex space-x-4">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="w-full rounded-full border-2 border-slate-500 bg-slate-900/50 px-4 py-2 backdrop-blur-lg"
          placeholder="Ask me anything!"
        />

        <Button className="bg-slate-900/50 backdrop-blur-lg">
          <PaperPlaneIcon className="mr-2" /> Send
        </Button>
      </div>
    </div>
  );
};
