import * as Toast from "@radix-ui/react-toast";

export const DeckCreationToast = () => (
  <>
    <Toast.Root className="card absolute bottom-12 right-12 bg-green-500">
      <Toast.Title>Successfully created deck</Toast.Title>
    </Toast.Root>

    <Toast.Viewport />
  </>
);

