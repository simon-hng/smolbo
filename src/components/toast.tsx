import * as Toast from "@radix-ui/react-toast";

interface ToastComponentProps {
  title: string;
  description?: string;
  status: "success" | "warning" | "error";
}

export const ToastComponent = ({
  title,
  description,
  status,
}: ToastComponentProps) => {
  const color = {
    success: "green-500",
    warning: "yellow-500",
    error: "red-500",
  }[status];

  return (
    <>
      <Toast.Root className={`card absolute bottom-12 right-12 bg-${color}`}>
        <Toast.Title>{title}</Toast.Title>
        {description && <Toast.Description>{description}</Toast.Description>}
      </Toast.Root>

      <Toast.Viewport />
    </>
  );
};
