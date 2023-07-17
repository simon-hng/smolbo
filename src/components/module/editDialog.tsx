import { Cross2Icon, Pencil1Icon } from "@radix-ui/react-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import toast from "react-hot-toast";
import type { Module } from "@prisma/client";
import { useFormik } from "formik";
import { InputText } from "~/components/ui/inputText";
import { api } from "~/utils/api";

interface Props {
  moduleId: string;
}
export const EditDialog = ({ moduleId }: Props) => {
  const updateMutation = api.module.update.useMutation();
  const deleteMutation = api.module.deleteById.useMutation();

  const formik = useFormik<Pick<Module, "id" | "title" | "description">>({
    initialValues: {
      id: "",
      title: "",
      description: "",
    },
    onSubmit: (values) =>
      void toast.promise(updateMutation.mutateAsync(values), {
        loading: "Updating module values",
        success: "Successfully updated module",
        error: "Failed to update module",
      }),
  });

  const { isLoading } = api.module.getById.useQuery(moduleId, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => void formik.setValues(data as Module),
  });

  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="primary">
            <Pencil1Icon aria-hidden className="mr-2" />
            <span className="w-max">Edit</span>
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-lg" />
          <Dialog.Content className="fixed-center container mx-auto p-8">
            <Card variant="primary">
              <div className="mb-4">
                <div className="flex flex-row justify-between">
                  <Dialog.Title className="mb-2 text-2xl">
                    Edit a module
                  </Dialog.Title>

                  <Dialog.Close className="flex h-8 w-8 items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-800">
                    <Cross2Icon />
                  </Dialog.Close>
                </div>
              </div>

              <form onSubmit={formik.handleSubmit}>
                <fieldset className="space-y-4">
                  <InputText
                    label="Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    className="w-full"
                    state={isLoading ? "skeleton" : "default"}
                  />

                  <InputText
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    className="w-full"
                    state={isLoading ? "skeleton" : "default"}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="red"
                      type="button"
                      onClick={() => {
                        void toast.promise(
                          deleteMutation.mutateAsync(moduleId),
                          {
                            loading: "Deleting module",
                            success: (data) =>
                              `Successfully deleted module with id ${data}`,
                            error: "Failed to delete module",
                          }
                        );
                      }}
                    >
                      Delete module
                    </Button>
                    <Button variant="primary" type="submit">
                      Save changes
                    </Button>
                  </div>
                </fieldset>
              </form>
            </Card>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
