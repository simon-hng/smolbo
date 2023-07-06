import type { Module } from "@prisma/client";
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

  const moduleQuery = api.module.getById.useQuery(router.query.id as string, {
    enabled: !!router.query.id,
    refetchOnWindowFocus: false,
    onSuccess: (data) => void formik.setValues(data as Module),
  });

  if (moduleQuery.isLoading) {
    return (
      <div className="pt-20">
        <Section className="space-y-8"></Section>
      </div>
    );
  }

  if (
    moduleQuery.error ||
    !moduleQuery.data ||
    typeof router.query.id !== "string"
  ) {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="skeleton mb-2 w-40 text-4xl font-semibold">
            Failed to load module
          </h1>
          <p> Module with id {router.query.id} not found</p>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="space-y-8">
        <form onSubmit={formik.handleSubmit}>
          <fieldset className="space-y-4">
            <InputText
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              className="w-full"
            />

            <InputText
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="red"
                type="button"
                onClick={() => {
                  void toast.promise(
                    deleteMutation
                      .mutateAsync(router.query.id as string)
                      .then(() => router.push("/modules")),
                    {
                      success: "Successfully deleted module with id",
                      loading: "Deleting module",
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
      </Section>
    </div>
  );
};

export default ModulesEditPage;
