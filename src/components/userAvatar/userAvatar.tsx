import * as Avatar from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";

interface UserAvatarProps {
  className?: string;
}

export const UserAvatar = ({ className }: UserAvatarProps) => {
  const { data: session } = useSession({ required: true });

  return (
    <Avatar.Root className={className}>
      {session?.user.image && (
        <Avatar.Image
          className="rounded-full"
          src={session.user.image}
          alt={session.user.name ?? "Your profile picture"}
        />
      )}

      {session?.user.name ? (
        <Avatar.Fallback>{session.user.name}</Avatar.Fallback>
      ) : (
        <Avatar.Fallback>?</Avatar.Fallback>
      )}
    </Avatar.Root>
  );
};
