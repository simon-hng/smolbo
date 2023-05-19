import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import * as Avatar from "@radix-ui/react-avatar";

export const User: NextPage = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <p>You&apos;re not signed in </p>;
  }

  return (
    <div>
      <Avatar.Root className="">
        {session.user.image && (
          <Avatar.Image
            className="rounded-full"
            src={session.user.image}
            alt={session.user.name ?? "Your profile picture"}
          />
        )}
        <Avatar.Fallback>{session.user.name}</Avatar.Fallback>
      </Avatar.Root>

      <p>Welcome {session.user.name}</p>
    </div>
  );
};
