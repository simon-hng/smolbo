import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { UserAvatar } from "~/components/userAvatar";

export const User: NextPage = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return <p>You&apos;re not signed in </p>;
  }

  return (
    <div>
      <UserAvatar />

      <p>Welcome {session.user.name}</p>
    </div>
  );
};
