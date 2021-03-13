import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { server } from '../mocks/server';
import ProductsList from '../pages/index';

describe('ProductsList', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should render the component', () => {
    render(<ProductsList />);

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('should render 10 product cards', async () => {
    render(<ProductsList />);

    const productCards = await screen.findAllByTestId('product-card');

    expect(productCards).toHaveLength(10);
  });

  it('should display the total quantity of products', async () => {
    render(<ProductsList />);

    const productAmount = await screen.findByText(/10 Products/i);

    expect(productAmount).toBeInTheDocument();
  });

  it('should display the total quantity of products - singular', async () => {
    const searchTerm = 'vivamus';
    render(<ProductsList />);

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    userEvent.type(input, searchTerm);
    fireEvent.submit(form);

    expect(await screen.findByText(/1 Product$/i)).toBeInTheDocument();
  });

  it('should display the no products message', () => {
    render(<ProductsList />);

    const message = screen.getByText(/No products found/i);

    expect(message).toBeInTheDocument();
  });

  it('should filter the product list', async () => {
    const searchTerm = 'vivamus';

    render(<ProductsList />);

    expect(await screen.findAllByTestId('product-card')).toHaveLength(10);

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    userEvent.type(input, searchTerm);
    fireEvent.submit(form);

    expect(await screen.findAllByTestId('product-card')).toHaveLength(1);
  });

  it('should clear the search when the button is clicked', async () => {
    const searchTerm = 'vivamus';
    render(<ProductsList />);

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    userEvent.type(input, searchTerm);
    fireEvent.submit(form);

    expect(await screen.findAllByTestId('product-card')).toHaveLength(1);

    userEvent.clear(input);

    expect(await screen.findAllByTestId('product-card')).toHaveLength(10);
  });
});
