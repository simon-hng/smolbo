import * as Toast from "@radix-ui/react-toast";

interface DeckDeletionToastProps {
  isSuccess: boolean;
  isError: boolean;
}

export const DeckDeletionToast = ({
  isSuccess,
  isError,
}: DeckDeletionToastProps) => {
  if (isSuccess) {
    return (
      <>
        <Toast.Root className="card absolute bottom-12 right-12 bg-green-500">
          <Toast.Title>Successfully deleted deck</Toast.Title>
        </Toast.Root>

        <Toast.Viewport />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Toast.Root className="card absolute bottom-12 right-12 bg-red-500">
          <Toast.Title>Failed to delete Deck</Toast.Title>
        </Toast.Root>

        <Toast.Viewport />
      </>
    );
  }

  return <></>;
};
