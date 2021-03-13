import { fireEvent, render, screen, within } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { setAutoFreeze } from 'immer';
import TestRenderer from 'react-test-renderer';

import { useCartState } from '../store/cart/';
import Cart from './cart';

const { act: ReactAct } = TestRenderer;

setAutoFreeze(false);

describe('Cart', () => {
  let result;
  let spy;
  let add;
  let toggle;
  let reset;

  beforeEach(() => {
    result = renderHook(() => useCartState()).result;
    add = result.current.actions.add;
    reset = result.current.actions.reset;
    toggle = result.current.actions.toggle;
    spy = jest.spyOn(result.current.actions, 'toggle');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component', () => {
    render(<Cart />);

    expect(screen.getByTestId('cart')).toHaveClass('hidden');
  });

  it('should not have class hidden when open', () => {
    act(() => {
      toggle();
    });

    render(<Cart />);

    expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
  });

  it('should call toggle() toggle', () => {
    render(<Cart />);

    const closeButton = screen.getByTestId('close');

    act(() => {
      userEvent.click(closeButton);
      userEvent.click(closeButton);
    });

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should display 2 products', async () => {
    const products = [
      { title: 'watch', id: 1 },
      { title: 'watch2', id: 2 },
    ];

    act(() => {
      products.forEach((prod) => add(prod));
    });

    render(<Cart />);

    expect(await screen.findAllByTestId('cart-item')).toHaveLength(2);
  });

  it('should remove all products when checkout is clicked', async () => {
    const products = [
      { title: 'watch', id: 1 },
      { title: 'watch2', id: 2 },
    ];

    act(() => {
      products.forEach((prod) => add(prod));
    });

    await ReactAct(async () => {
      render(<Cart />);

      expect(await screen.findAllByTestId('cart-item')).toHaveLength(2);

      const clearCartButton = screen.getByRole('button', { name: /clear cart/i });

      fireEvent.click(clearCartButton);

      const noProductsMessage = screen.getByRole('heading', {
        name: /there are no products in the cart!/i,
      });

      expect(noProductsMessage).toBeInTheDocument();

      expect(screen.queryByTestId('cart-item')).toBeNull();
    });
  });

  it('should not display clear cart button when there are no products', () => {
    render(<Cart />);

    const clearCartButton = screen.queryByRole('button', { name: /clear cart/i });

    expect(screen.queryByTestId('cart-item')).toBeNull();
    expect(clearCartButton).not.toBeInTheDocument();
  });

  it('should increase the quantity by one', async () => {
    const products = [
      { title: 'watch', id: 1 },
      { title: 'watch2', id: 2 },
    ];

    act(() => {
      products.forEach((prod) => add(prod));
    });

    await ReactAct(async () => {
      render(<Cart />);

      const [firstItem, _] = await screen.findAllByTestId('cart-item');

      const firstAddBtn = within(firstItem).getByTestId('plus');

      fireEvent.click(firstAddBtn);
      fireEvent.click(firstAddBtn);

      const firstItemQuantity = within(firstItem).getByTestId('quantity');

      expect(firstItemQuantity).toHaveTextContent('3');
    });
  });

  it('should decrease the quantity by one', async () => {
    const products = [
      { title: 'watch', id: 1 },
      { title: 'watch2', id: 2 },
    ];

    act(() => {
      reset();
      products.forEach((prod) => add(prod));
    });

    await ReactAct(async () => {
      render(<Cart />);

      const [cartItem, _] = await screen.findAllByTestId('cart-item');

      const lessBtn = within(cartItem).getByTestId('less');

      fireEvent.click(lessBtn);
      fireEvent.click(lessBtn);
      fireEvent.click(lessBtn);

      const quantity = within(cartItem).getByTestId('quantity');

      expect(quantity).toHaveTextContent('0');
    });
  });
});
