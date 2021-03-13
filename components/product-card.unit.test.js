import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProductCard from './product-card';

const addToCart = jest.fn();
describe('ProductCard', () => {
  const product = {
    title: 'Nice watch',
    price: '22.00',
    image:
      'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
  };

  it('should render the component with the props product', () => {
    render(<ProductCard product={product} addToCart={addToCart} />);

    const title = screen.getByRole('heading', { name: product.title });
    const price = screen.getByText(/22.00/i);
    const image = screen.getByTestId('image');

    expect(title).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(image).toHaveStyle(`backgroundImage:url(${product.image})`);
  });

  it('should call add to cart whe the button is clicked', async () => {
    render(<ProductCard product={product} addToCart={addToCart} />);

    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toBeCalledWith(product);
  });
});
