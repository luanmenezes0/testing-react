import { fireEvent, render, screen } from '@testing-library/react';

import CartItem from './cart-item';

const product = {
  id: 1,
  title: 'Nice watch',
  price: '22.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

const remove = jest.fn();

const renderCartItem = () => {
  render(<CartItem product={product} remove={remove} />);
};

describe('CartItem', () => {
  it('should render the component', () => {
    renderCartItem();

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });
  it('should display product content', () => {
    renderCartItem();

    const title = screen.getByRole('heading', { name: product.title });
    const price = screen.getByText(/22.00/i);
    const image = screen.getByTestId('image');

    expect(title).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(image).toHaveProperty('src', product.image);
    expect(image).toHaveProperty('alt', product.title);
  });

  it('should remove product when remove button is clicked', () => {
    const remove = jest.fn();

    render(<CartItem product={product} remove={remove} />);

    const removeBtn = screen.getByRole('button', { name: /remove/i });

    fireEvent.click(removeBtn);

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(product.id);
  });
});
