// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  todos: {
    id: string;
    todo: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const result = await fetch(
      `https://dummyjson.com/todos?skip=${req.query.skip}&limit=${req.query.limit}`
    );
    const data = await result.json();
    const todos = data?.todos;

    if (todos) {
      res.status(200).json(todos);
    }
  }
}
