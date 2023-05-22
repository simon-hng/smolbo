import { useSession } from "next-auth/react";
import {
  DeckCreation,
  DeckCarousel,
  DeckCarouselSkeleton,
  DeckCreationSkeleton,
} from "~/components/deck";

export const DecksPage = () => {
  const { data: session, status } = useSession({
    required: true,
  });

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <DeckCarouselSkeleton />
        <DeckCreationSkeleton />
      </div>
    );
  }

  if (!session) {
    return <h1 className="text-4xl font-bold">You need to be logged in</h1>;
  }

  return (
    <div className="space-y-4">
      <DeckCarousel />
      <DeckCreation />
    </div>
  );
};

export default DecksPage;
