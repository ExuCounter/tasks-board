// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  todos: {
    id: string;
    todo: string;
    completed: boolean;
    userId: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const data = await fetch("https://dummyjson.com/todos");
    res.status(200).json(await data.json());
  }
}
