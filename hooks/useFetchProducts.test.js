import { renderHook } from '@testing-library/react-hooks';

import useFetchProducts from './useFetchProducts';
import { server } from '../mocks/server';

describe('useFetchProducts hook', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should fetch products', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchProducts());

    await waitForNextUpdate();

    const [products, error] = result.current;

    expect(products).toHaveLength(10);
    expect(error).toBe(false);
  });
});
