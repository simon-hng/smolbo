import { Cross2Icon, FilePlusIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { type MouseEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import toast from "react-hot-toast";

interface Props {
  deckId: string;
}
export const UploadDialog = ({ deckId }: Props) => {
  const [file, setFile] = useState<File>();

  const handleUpload: MouseEventHandler<HTMLButtonElement> &
    MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.set("file", file);

    // TODO add deckid index to api query and pass to pinecone
    fetch("/api/upload/route", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        console.log(res);
        toast.success(`upload success`);
      })
      .catch((e) => {
        console.log(e);
        toast.error("failed");
      });
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="primary">
            <FilePlusIcon aria-hidden className="mr-2" />
            Upload PDF
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg" />
          <Dialog.Content className="fixed-center container mx-auto p-8">
            <Card variant="primary">
              <div className="mb-4">
                <div className="flex flex-row justify-between">
                  <Dialog.Title className="mb-2 text-2xl">
                    Upload a PDF
                  </Dialog.Title>

                  <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                    <Cross2Icon />
                  </Dialog.Close>
                </div>

                <Dialog.Description>
                  Create embeddings and generate responses based on your PDFs
                </Dialog.Description>
              </div>

              <input
                className="mb-4"
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files?.[0])}
              />

              <div>
                <Dialog.Close asChild>
                  <Button onClick={handleUpload}>Upload</Button>
                </Dialog.Close>
              </div>
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
