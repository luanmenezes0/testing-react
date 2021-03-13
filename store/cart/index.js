import create from 'zustand';
import produce from 'immer';

const initialState = {
  open: false,
  products: [],
};

export const useCartState = create((set) => ({
  state: { ...initialState },
  actions: {
    toggle() {
      set(
        produce(({ state }) => {
          state.open = !state.open;
        }),
      );
    },
    reset() {
      set(
        produce((store) => {
          store.state = initialState;
        }),
      );
    },
    add(product) {
      set(
        produce(({ state }) => {
          const isInTheCart = state.products.find(({ id }) => id === product.id);
          if (!isInTheCart) {
            state.open = true;
            state.products.push({ ...product, quantity: 1 });
          }
        }),
      );
    },
    increase(prodId) {
      set(
        produce(({ state }) => {
          const prod = state.products.find((prod) => prod.id === prodId);
          if (prod) {
            prod.quantity++;
          }
        }),
      );
    },
    decrease(prodId) {
      set(
        produce(({ state }) => {
          const prod = state.products.find((prod) => prod.id === prodId);
          if (prod) {
            if (prod.quantity === 0) return;
            prod.quantity--;
          }
        }),
      );
    },
    remove(prodId) {
      set(
        produce(({ state }) => {
          state.products = state.products.filter(({ id }) => prodId !== id);
        }),
      );
    },
    removeAll() {
      set(
        produce(({ state }) => {
          state.products = [];
        }),
      );
    },
  },
}));
