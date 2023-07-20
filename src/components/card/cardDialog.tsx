import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { api } from "~/utils/api";
import type { Card } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Card as CardComponent } from "@ui/card";
import { useFormik } from "formik";
import { InputText } from "../ui/inputText";
import { type RequireAtLeastOne } from "~/utils/ts-utils";

interface CardCreationDialogProps {
  children?: React.ReactNode;
  card: RequireAtLeastOne<Partial<Card>, "moduleId" | "id">;
}

export const CardDialog = ({ children, card }: CardCreationDialogProps) => {
  const [open, setOpen] = useState(false);
  const ctx = api.useContext();
  const Trigger = children ?? (
    <Button variant="primary">
      <PlusIcon aria-hidden className="mr-2" />
      Card
    </Button>
  );
  const cardCreateMutation = api.card.create.useMutation();
  const cardUpdateMutation = api.card.update.useMutation();

  const formik = useFormik<Pick<Card, "front" | "back">>({
    initialValues: {
      front: card?.front ?? "",
      back: card?.back ?? "",
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const submit: () => Promise<Card> = () => {
        if (!!card.id) {
          return cardUpdateMutation.mutateAsync({
            id: card.id,
            ...card,
            ...values,
          } as Card);
        }
        if (!!card.moduleId)
          return cardCreateMutation.mutateAsync({
            moduleId: card.moduleId,
            ...values,
          });
        return Promise.reject();
      };

      void toast
        .promise(submit(), {
          loading: "Saving card",
          success: "Succesfully saved card",
          error: "Failed to save card ",
        })
        .then(() => setSubmitting(false))
        .then(() => ctx.module.invalidate())
        .then(() => resetForm());
    },
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
                  {!!card.id && "Edit card"}
                  {!card.id && "Create a new card"}
                </Dialog.Title>

                <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                  <Cross2Icon />
                </Dialog.Close>
              </div>

              <Dialog.Description>
                {!!card.id && `You are editing a card`}
                {!card.id && `You are creating a new card`}
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
                <textarea className="h-32 resize-none" />
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
