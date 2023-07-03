import type { Deck } from "@prisma/client";
import { useFormik } from "formik";
import Link from "next/link";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { InputText } from "~/components/ui/inputText";
import { Section } from "~/components/ui/section";
import { api } from "~/utils/api";

const DecksEditPage: NextPage = () => {
  const { query } = useRouter();

  const formik = useFormik<Partial<Deck>>({
    initialValues: {},
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
    },
  });

  const deckQuery = api.deck.getById.useQuery(query.id as string, {
    enabled: !!query.id,
    onSuccess: (data) => void formik.setValues(data ?? {}),
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

  const deck = deckQuery.data;
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
          </fieldset>
        </form>

        <div className="flex justify-end gap-2">
          <Button variant="primary" type="submit">
            Save changes
          </Button>
        </div>
      </Section>
    </div>
  );
};

export default DecksEditPage;
