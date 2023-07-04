import type { Deck } from "@prisma/client";
import { useFormik } from "formik";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { InputText } from "~/components/ui/inputText";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const DecksEditPage: NextPage = () => {
  const router = useRouter();

  const updateMutation = api.deck.update.useMutation();
  const deleteMutation = api.deck.deleteById.useMutation();

  const formik = useFormik<Pick<Deck, "id" | "title" | "description">>({
    initialValues: {
      id: "",
      title: "",
      description: "",
    },
    onSubmit: (values) =>
      void toast.promise(updateMutation.mutateAsync(values), {
        loading: "Updating deck values",
        success: "Successfully updated deck",
        error: "Failed to update deck",
      }),
  });

  const deckQuery = api.deck.getById.useQuery(router.query.id as string, {
    enabled: !!router.query.id,
    refetchOnWindowFocus: false,
    onSuccess: (data) => void formik.setValues(data as Deck),
  });

  if (deckQuery.isLoading) {
    return (
      <div className="pt-20">
        <Section className="space-y-8"></Section>
      </div>
    );
  }

  if (
    deckQuery.error ||
    !deckQuery.data ||
    typeof router.query.id !== "string"
  ) {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="skeleton mb-2 w-40 text-4xl font-semibold">
            Failed to load deck
          </h1>
          <p> Deck with id {router.query.id} not found</p>
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
                      .then(() => router.push("/decks")),
                    {
                      success: "Successfully deleted deck with id",
                      loading: "Deleting deck",
                      error: "Failed to delete deck",
                    }
                  );
                }}
              >
                Delete deck
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

export default DecksEditPage;
