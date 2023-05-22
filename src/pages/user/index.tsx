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
      <h1 className="mb-8 text-4xl">General Settings</h1>

      <div className="space-y-4">
        <UserAvatar />

        <label className="flex flex-col">
          Name
          <input className="textarea" value={session.user.name ?? "err"} />
        </label>

        <label className="flex flex-col">
          Email
          <input className="textarea" value={session.user.email ?? "err"} />
        </label>
      </div>
    </div>
  );
};

export default User;
