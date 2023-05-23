import { useSession } from "next-auth/react";
import {
  DeckCreation,
  DeckCarousel,
  DeckCarouselSkeleton,
  DeckCreationSkeleton,
} from "~/components/deck";
import { ToastComponent } from "~/components/toast";
import { api } from "~/utils/api";

export const DecksPage = () => {
  const { data: session, status } = useSession({
    required: true,
  });

  const decksQuery = api.deck.getAllForUser.useQuery(session?.user.id ?? "", {
    enabled: Boolean(session?.user.id),
  });
  const deckCreateMutation = api.deck.create.useMutation({
    onSettled: async () => {
      await decksQuery.refetch();
    },
  });
  const deckDeleteMutation = api.deck.deleteById.useMutation({
    onSettled: async () => {
      await decksQuery.refetch();
    },
  });

  const deckApi = { decksQuery, deckCreateMutation, deckDeleteMutation };

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <DeckCarouselSkeleton />
        <DeckCreationSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DeckCarousel {...deckApi} />
      <DeckCreation {...deckApi} />

      {deckCreateMutation.isSuccess && (
        <ToastComponent
          title={`successfully created deck ${deckCreateMutation.data.title}`}
          status="success"
        />
      )}
      {deckDeleteMutation.isSuccess && (
        <ToastComponent title={`successfully deleted deck`} status="success" />
      )}
    </div>
  );
};

export default DecksPage;
