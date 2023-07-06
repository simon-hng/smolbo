import { CardStackPlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Editor } from "../ui/editor";

export const ModuleCreationDialog = () => {
  const ctx = api.useContext();
  const moduleCreateMutation = api.module.create.useMutation({
    onSuccess: () => {
      void ctx.module.invalidate();
    },
  });

  const [module, setModule] = useState({
    title: "",
    description: "",
  });

  const saveHandler = () => {
    moduleCreateMutation.mutate({
      ...module,
    });
  };

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="primary">
            <CardStackPlusIcon aria-hidden className="mr-2" />
            Create Module
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg" />
          <Dialog.Content className="fixed-center container mx-auto p-8">
            <Card variant="primary">
              <div className="mb-4">
                <div className="flex flex-row justify-between">
                  <Dialog.Title className="mb-2 text-2xl">
                    Create a new module
                  </Dialog.Title>

                  <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                    <Cross2Icon />
                  </Dialog.Close>
                </div>

                <Dialog.Description>
                  Modules offer offer a way of grouping cards
                </Dialog.Description>
              </div>

              <div className="flex flex-col space-y-4">
                <label className="flex flex-col">
                  Module title
                  <Editor
                    options={{ wordWrap: "on", minimap: { autohide: true } }}
                    height="10rem"
                    value={module.title}
                    onChange={(value) => {
                      return setModule({ ...module, title: value ?? module.title });
                    }}
                  />
                </label>

                <label className="flex flex-col">
                  Module description
                  <Editor
                    options={{ wordWrap: "on", minimap: { autohide: true } }}
                    height="10rem"
                    value={module.description}
                    onChange={(value) => {
                      return setModule({
                        ...module,
                        description: value ?? module.description,
                      });
                    }}
                  />
                </label>

                <div>
                  <Dialog.Close asChild>
                    <Button variant="primary" onClick={saveHandler}>
                      save
                    </Button>
                  </Dialog.Close>
                </div>
              </div>
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
