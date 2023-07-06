import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import type { Card, Module } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Card as CardComponent } from "@ui/card";
import { useFormik } from "formik";
import { InputText } from "../ui/inputText";

interface CardCreationDialogProps {
  module: Module;
  children?: React.ReactNode;
}

export const CardCreationDialog = ({
  module,
  children,
}: CardCreationDialogProps) => {
  const [open, setOpen] = useState(false);
  const ctx = api.useContext();
  const Trigger = children ?? (
    <Button variant="primary">
      <PlusIcon aria-hidden className="mr-2" />
      Card
    </Button>
  );
  const cardCreateMutation = api.card.create.useMutation({
    onSuccess: () => ctx.module.invalidate(),
  });

  const formik = useFormik<Pick<Card, "front" | "back">>({
    initialValues: {
      front: "",
      back: "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) =>
      void toast
        .promise(
          cardCreateMutation.mutateAsync({ moduleId: module.id, ...values }),
          {
            loading: "Creating new card",
            success: "Succesfully created card",
            error: "Failed to create module",
          }
        )
        .then(() => setSubmitting(false))
        .then(() => resetForm()),
  });

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>{Trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg" />
        <Dialog.Content className="fixed-center container mx-auto p-8">
          <CardComponent variant="primary">
            <div className="mb-4">
              <div className="flex flex-row justify-between">
                <Dialog.Title className="mb-2 text-2xl">
                  Create a new card
                </Dialog.Title>

                <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                  <Cross2Icon />
                </Dialog.Close>
              </div>

              <Dialog.Description>
                You are adding a card to {module.title}
              </Dialog.Description>
            </div>

            <form
              className="flex flex-col space-y-4"
              onSubmit={formik.handleSubmit}
            >
              <InputText
                label="Front"
                name="front"
                value={formik.values.front}
                onChange={formik.handleChange}
              />

              <InputText
                label="Back"
                name="back"
                value={formik.values.back}
                onChange={formik.handleChange}
                asChild
              >
                <textarea className="h-32" />
              </InputText>

              <div className="flex justify-end gap-2">
                <Button variant="primary" type="submit">
                  save
                </Button>
              </div>
            </form>
          </CardComponent>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
