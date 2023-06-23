import formidable from "formidable";
import { type IncomingMessage } from "http";
import type { NextApiResponse } from "next/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: IncomingMessage, res: NextApiResponse) {
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    console.log(err, fields, files);
  });

  res.status(200).json({ success: "true" });
}
