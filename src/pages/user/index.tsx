import { UserAvatar } from "~/components/userAvatar";
import { api } from "~/utils/api";
import * as Slider from "@radix-ui/react-slider";
import type { User } from "@prisma/client";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Section } from "~/components/ui/section";
import { InputText } from "~/components/ui/inputText";
import { useFormik } from "formik";

export const UserPage = () => {
  const userMutation = api.user.updateUser.useMutation();
  const formik = useFormik<
    Pick<User, "id" | "name" | "email" | "maxCardsPerSession">
  >({
    initialValues: {
      id: "",
      name: null,
      email: null,
      maxCardsPerSession: 0,
    },
    onSubmit: (values) =>
      void toast.promise(userMutation.mutateAsync(values), {
        loading: "Updating user information",
        success: "Successfully updated user information",
        error: "Failed to update user information",
      }),
  });
  const userQuery = api.user.getUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => void formik.setValues(data as User),
    onError: () => {
      toast.error("Failed to get user");
    },
  });

  if (userQuery.isLoading) {
    return (
      <div className="pt-20">
        <Section>
          <h1 className="mb-8 text-4xl font-semibold">General Settings</h1>

          <div className="space-y-4">
            <div className="skeleton h-32 w-32 rounded-full" />

            <InputText label="Name" state="skeleton" />

            <InputText label="Email" state="skeleton" />

            <div className="flex space-x-2">
              <Button variant="skeleton" />
              <Button variant="skeleton" />
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section>
        <h1 className="mb-8 text-4xl font-semibold">General Settings</h1>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <UserAvatar />

            <InputText
              label="Name"
              name="name"
              value={formik.values.name ?? ""}
              onChange={formik.handleChange}
              className="w-full"
            />

            <InputText
              label="Email"
              name="email"
              value={formik.values.email ?? ""}
              onChange={formik.handleChange}
              className="w-full"
            />

            <label className="flex flex-col">
              <span className="mb-2 ml-6">
                Max cards per session: {formik.values.maxCardsPerSession}
              </span>
              <Slider.Root
                className="relative flex h-5 w-full touch-none select-none items-center"
                value={[formik.values.maxCardsPerSession]}
                onValueChange={(values: number[]) =>
                  void formik.setFieldValue(
                    "maxCardsPerSession",
                    values.at(0) as number
                  )
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

            <div className="flex justify-end space-x-2">
              <Button variant="primary" type="submit">
                Save
              </Button>

              <Button
                variant="primary"
                type="button"
                onClick={() =>
                  void toast.promise(userQuery.refetch(), {
                    loading: "Resetting user information",
                    success: "Reset user information to previous",
                    error: "Failed to reset user information",
                  })
                }
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
      </Section>
    </div>
  );
};

export default UserPage;
