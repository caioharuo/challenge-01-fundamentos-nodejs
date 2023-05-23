import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

(async () => {
  const tasksParsed = createReadStream(`${__dirname}/../../tasks.csv`).pipe(
    parse({
      skipEmptyLines: true,
      fromLine: 2,
    })
  );

  for await (const task of tasksParsed) {
    const [title, description] = task;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
  }
})();
