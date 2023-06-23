import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Section } from "~/components/ui/section";

export const UploadPage = () => {
  const [file, setFile] = useState<File>();
  return (
    <div className="pt-20">
      <Section className="space-y-4">
        <h1 className="mb-8 text-4xl">Upload a pdf</h1>

        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (!file) return;

            const data = new FormData();
            data.set("file", file);

            fetch("/api/upload/route", {
              method: "POST",
              body: data,
            }).catch((e) => console.log(e));
          }}
        >
          Upload
        </Button>
      </Section>
    </div>
  );
};

export default UploadPage;
