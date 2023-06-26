// TODO tailwind type is bugged here
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Editor as MonacoEditor,
  type EditorProps,
  useMonaco,
} from "@monaco-editor/react";
import { type VariantProps, cva } from "class-variance-authority";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

export const styles = cva();

export interface Props extends VariantProps<typeof styles>, EditorProps {}

export const Editor = ({ ...props }: Props) => {
  const fullConfig: any = resolveConfig(tailwindConfig);

  const monaco = useMonaco();
  monaco?.editor.defineTheme("default", {
    base: "vs-dark",
    inherit: false,
    rules: [],
    colors: {
      "editor.foreground": fullConfig.theme.colors.foreground,
      "editor.background": fullConfig.theme.colors.background,
    },
  });

  return (
    <MonacoEditor
      options={{ wordWrap: "on", minimap: { autohide: true } }}
      defaultLanguage="Markdown"
      theme="default"
      {...props}
    />
  );
};
