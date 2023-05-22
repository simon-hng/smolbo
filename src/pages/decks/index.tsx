import { useSession } from "next-auth/react";
import {
  DeckCreation,
  DeckCarousel,
  DeckCarouselSkeleton,
  DeckCreationSkeleton,
} from "~/components/deck";
import { api } from "~/utils/api";

export const DecksPage = () => {
  const { data: session, status } = useSession({
    required: true,
  });

  const query = api.deck.getAllForUser.useQuery(session?.user.id ?? "", {
    enabled: Boolean(session?.user.id),
  });

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
      <DeckCarousel query={query} />
      <DeckCreation query={query} />
    </div>
  );
};

export default DecksPage;
