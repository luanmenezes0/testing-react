import { rest } from 'msw';

import data from './data/products';

export const handlers = [
  rest.get('https://backend/products', (req, res, ctx) => {
    return res(ctx.json(data), ctx.status(200));
  }),
];
