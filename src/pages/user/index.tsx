import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserAvatar } from "~/components/userAvatar";
import { api } from "~/utils/api";
import * as Slider from "@radix-ui/react-slider";
import type { User } from "@prisma/client";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Section } from "~/components/ui/section";

export const UserPage = () => {
  const { data: session, status } = useSession({ required: true });
  const [user, setUser] = useState<User | null>();
  const userQuery = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      toast.error("Failed to get user");
    },
  });
  const userMutation = api.user.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Updated user information");
    },
  });

  if (userQuery.isLoading || status === "loading" || !user) {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="mb-8 text-4xl">General Settings</h1>

          <div className="space-y-4">
            <div className="skeleton h-32 w-32 rounded-full" />

            <label className="flex flex-col">
              Name
              <input className="textarea skeleton" />
            </label>

            <label className="flex flex-col">
              Email
              <input className="textarea skeleton" />
            </label>

            <div className="flex space-x-2">
              <Button color="skeleton" />
              <Button color="skeleton" />
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section>
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

          <label className="flex flex-col">
            Max cards per session: {user.maxCardsPerSession}
            <Slider.Root
              className="relative flex h-5 w-full touch-none select-none items-center"
              value={[user.maxCardsPerSession]}
              onValueChange={(value: number[]) =>
                setUser({
                  ...user,
                  maxCardsPerSession: value.at(0) as number,
                })
              }
              max={80}
              step={1}
            >
              <Slider.Track className="bg-blackA10 relative h-[3px] grow rounded-full">
                <Slider.Range className="absolute h-full rounded-full bg-white" />
              </Slider.Track>
              <Slider.Thumb
                className="hover:bg-violet3 block h-5 w-5 rounded-full bg-white"
                aria-label="Volume"
              />
            </Slider.Root>
          </label>

          <div className="flex space-x-2">
            <Button
              color="primary"
              onClick={() => {
                userMutation.mutate(user);
              }}
            >
              Save
            </Button>

            <Button
              color="primary"
              onClick={() => {
                void userQuery.refetch();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default UserPage;
