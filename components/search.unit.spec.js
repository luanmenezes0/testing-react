import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Search from './search';

const doSearch = jest.fn();

describe('Search', () => {
  afterEach(() => jest.resetAllMocks());
  it('should render a form', () => {
    render(<Search doSearch={doSearch} />);

    expect(screen.getByRole('form')).toBeInTheDocument();
  });
  it('should call props.doSearch when form is submitted', () => {
    render(<Search doSearch={doSearch} />);

    const form = screen.getByRole('form');

    fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledTimes(1);
  });

  it('should render an input of type search', () => {
    render(<Search doSearch={doSearch} />);
    const input = screen.getByRole('searchbox');

    expect(input).toHaveProperty('type', 'search');
  });

  it('should call props.doSearch with user input', async () => {
    render(<Search doSearch={doSearch} />);

    const form = screen.getByRole('form');
    const inputText = 'some text here';
    const input = screen.getByRole('searchbox');

    userEvent.type(input, inputText);
    fireEvent.submit(form);

    expect(doSearch).toHaveBeenCalledWith(inputText);
  });

  it('should call props.doSearch with input is cleared', async () => {
    render(<Search doSearch={doSearch} />);

    const input = screen.getByRole('searchbox');
    userEvent.type(input, 'some random text');
    userEvent.clear(input);

    expect(doSearch).toHaveBeenCalledWith('');
    expect(doSearch).toHaveBeenCalledTimes(1);
  });
});
