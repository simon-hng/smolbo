import { CardStackPlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useFormik } from "formik";
import { type Module } from "@prisma/client";
import toast from "react-hot-toast";
import { InputText } from "../ui/inputText";

export const ModuleCreationDialog = () => {
  const [open, setOpen] = useState(false);
  const ctx = api.useContext();
  const moduleCreateMutation = api.module.create.useMutation({
    onSuccess: () => {
      void ctx.module.invalidate();
    },
  });

  const formik = useFormik<Pick<Module, "title" | "description">>({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: (values, { setSubmitting }) =>
      void toast
        .promise(moduleCreateMutation.mutateAsync(values), {
          loading: "Creating new module",
          success: (data) => `Succesfully created module ${data?.title}`,
          error: "Failed to create module",
        })
        .then(() => setSubmitting(false))
        .then(() => setOpen(false)),
  });

  return (
    <>
      <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
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
              <div className="mb-8">
                <div className="flex flex-row justify-between">
                  <Dialog.Title className="mb-2 text-2xl">
                    Create a new module
                  </Dialog.Title>

                  <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                    <Cross2Icon />
                  </Dialog.Close>
                </div>

                <Dialog.Description>
                  Create modules to keep track of all your course work,
                  knowledge sources and notes
                </Dialog.Description>
              </div>

              <form
                className="flex flex-col space-y-4"
                onSubmit={formik.handleSubmit}
              >
                <InputText
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />

                <InputText
                  label="Description"
                  name="description"
                  value={formik.values.description}
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
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
