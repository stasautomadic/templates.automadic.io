import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'creatomate';
import Airtable from 'airtable';

const client = new Client(process.env.NEXT_PUBLIC_CREATOMATE_API_KEY!);
const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve) => {
    if (req.method === 'POST') {
      if (!process.env.NEXT_PUBLIC_CREATOMATE_API_KEY) {
        res.status(401).end();
        resolve();
        return;
      }

      const { source, userId , templateNames } = req.body;

      /** @type {import('creatomate').RenderOptions} */
      const options = {
        source,
      };

      client
      .render(options)
      .then(async (renders) => {
        const render = renders[0];

        const records = await base('videos').create([
          { fields: { Name: render.url, URL: render.url, User: [userId] , templateNames: templateNames } },
        ]);
      
        res.status(200).json(render);
        resolve();
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
        console.log(error);
        resolve();
      });
  } else {
    res.status(404).end();
    resolve();
  }
});
}
