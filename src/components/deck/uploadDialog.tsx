import { Cross2Icon, FilePlusIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import {
  type MouseEventHandler,
  useState,
  type ChangeEventHandler,
} from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import toast from "react-hot-toast";

interface Props {
  deckId: string;
}
export const UploadDialog = ({ deckId }: Props) => {
  const [files, setFiles] = useState<FileList>();

  const handleFileInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    setFiles(e.target.files);
  };

  const handleUpload: MouseEventHandler<HTMLButtonElement> &
    MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    if (!files) return;

    const data = new FormData();
    data.set("deckId", deckId);

    for (const file of files) {
      data.set(file.name, file);
    }

    fetch("/api/upload/", {
      method: "POST",
      body: data,
    })
      .then(() => {
        toast.success(`upload success`);
      })
      .catch(() => {
        toast.error("failed");
      });
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="primary">
            <FilePlusIcon aria-hidden className="mr-2" />
            <span className="w-max">Upload PDF</span>
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
                multiple
                onChange={handleFileInput}
              />

              <div>
                <Dialog.Close asChild>
                  <Button onClick={handleUpload} variant="primary">
                    Upload
                  </Button>
                </Dialog.Close>
              </div>
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
