import type { Module } from "@prisma/client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useFormik } from "formik";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { InputText } from "~/components/ui/inputText";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const ModulesEditPage: NextPage = () => {
  const router = useRouter();

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

  const { isLoading } = api.module.getById.useQuery(router.query.id as string, {
    enabled: !!router.query.id,
    refetchOnWindowFocus: false,
    onSuccess: (data) => void formik.setValues(data as Module),
  });

  return (
    <div className="pt-20">
      <Section className="space-y-8">
        <div className="mb-2 flex items-center gap-6">
          <button onClick={() => router.back()}>
            <ArrowLeftIcon className="h-8 w-8" />
          </button>

          <h1 className="text-4xl font-semibold">Edit module</h1>
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
                  void toast
                    .promise(
                      deleteMutation.mutateAsync(router.query.id as string),
                      {
                        loading: "Deleting module",
                        success: (data) =>
                          `Successfully deleted module with id ${data}`,
                        error: "Failed to delete module",
                      }
                    )
                    .then(() => router.push("/modules"));
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
      </Section>
    </div>
  );
};

export default ModulesEditPage;
