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
  const { query } = useRouter();

  const { mutate } = api.deck.update.useMutation({
    onSuccess: () => {
      toast.success("Updated deck information");
    },
  });

  const formik = useFormik<Pick<Deck, "id" | "title" | "description">>({
    initialValues: {
      id: "",
      title: "",
      description: "",
    },
    onSubmit: (values) => {
      mutate(values);
    },
  });

  const deckQuery = api.deck.getById.useQuery(query.id as string, {
    enabled: !!query.id,
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

  if (deckQuery.error || !deckQuery.data || typeof query.id !== "string") {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="skeleton mb-2 w-40 text-4xl font-semibold">
            Failed to load deck
          </h1>
          <p> Deck with id {query.id} not found</p>
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
