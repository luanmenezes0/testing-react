import { renderHook, act } from '@testing-library/react-hooks';

import { useCartState } from '.';

describe('Cart Store', () => {
  let result;

  beforeEach(() => {
    result = renderHook(() => useCartState()).result;
  });

  afterEach(() => {
    act(() => result.current.actions.reset());
  });

  it('should return cart initial state - open', () => {
    expect(result.current.state.open).toBe(false);
  });

  it('should return cart initial state - products', () => {
    expect(result.current.state.products).toHaveLength(0);
    expect(Array.isArray(result.current.state.products)).toBe(true);
  });

  it('should toggle open state', () => {
    const {
      actions: { toggle },
    } = result.current;

    expect(result.current.state.open).toBe(false);

    act(() => toggle());
    expect(result.current.state.open).toBe(true);

    act(() => toggle());
    expect(result.current.state.open).toBe(false);
  });

  it('should add products', () => {
    const {
      actions: { add },
    } = result.current;

    const products = [
      { title: 'watch', id: 1 },
      { title: 'watch2', id: 2 },
    ];

    expect(result.current.state.products).toHaveLength(0);

    products.forEach((product) => {
      act(() => add(product));
    });

    expect(result.current.state.products).toHaveLength(2);
  });

  it('should set 1 as inital quantity when a product is added', () => {
    const {
      actions: { add },
    } = result.current;

    const product = { title: 'watch', id: 1 };

    act(() => add(product));
    expect(result.current.state.products[0]).toHaveProperty('quantity', 1);
  });

  it('should increase quantity by 1', () => {
    const {
      actions: { add, increase },
    } = result.current;

    const product = { title: 'watch', id: 1 };

    act(() => add(product));

    act(() => increase(1));
    const [item] = result.current.state.products;

    expect(item).toHaveProperty('quantity', 2);
  });

  it('should decrease quantity by 1', () => {
    const {
      actions: { add, decrease, increase },
    } = result.current;

    const product = { title: 'watch', id: 1 };

    act(() => add(product));
    act(() => increase(1));
    act(() => decrease(1));

    const [item] = result.current.state.products;

    expect(item).toHaveProperty('quantity', 1);
  });

  it('should not allow quantity to be less than 0', () => {
    const {
      actions: { add, decrease },
    } = result.current;

    const product = { title: 'watch', id: 1 };

    act(() => add(product));
    act(() => decrease(1));
    act(() => decrease(1));
    
    const [item] = result.current.state.products;

    expect(item).toHaveProperty('quantity', 0);
  });

  it('should open the cart when a product is added', () => {
    const {
      actions: { add },
    } = result.current;

    const product = { title: 'watch', id: 1 };

    act(() => add(product));

    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.open).toBe(true);
  });

  it('should not allow the same product to be added more than once', () => {
    const {
      actions: { add },
    } = result.current;

    const product = { title: 'watch', id: 1 };

    act(() => add(product));
    act(() => add(product));

    expect(result.current.state.products).toHaveLength(1);
  });

  it('should remove a product from the cart', () => {
    const {
      actions: { remove, add },
    } = result.current;

    const product = { title: 'watch', id: 1 };
    const product2 = { title: 'watch', id: 2 };

    act(() => add(product));
    act(() => add(product2));
    expect(result.current.state.products).toHaveLength(2);

    act(() => remove(1));
    expect(result.current.state.products).toHaveLength(1);
  });

  it('should remove all products from the cart', () => {
    const {
      actions: { removeAll, add },
    } = result.current;

    const product = { title: 'watch', id: 1 };
    const product2 = { title: 'watch', id: 2 };

    act(() => add(product));
    act(() => add(product2));
    expect(result.current.state.products).toHaveLength(2);

    act(() => removeAll());
    expect(result.current.state.products).toHaveLength(0);
  });
});
