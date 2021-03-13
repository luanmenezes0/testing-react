import ProductCard from '../components/product-card';
import { useState, useEffect } from 'react';
import Search from '../components/search';
import useFetchProducts from '../hooks/useFetchProducts';
import { useCartState } from '../store/cart/';

export default function Home() {
  const [products, error] = useFetchProducts();

  const [localProducts, setLocalProducts] = useState([]);
  const [term, setTerm] = useState('');

  const addToCart = useCartState((store) => store.actions.add);

  useEffect(() => {
    if (term === '') {
      setLocalProducts(products);
    } else {
      setLocalProducts(
        products.filter(({ title }) => title.toLowerCase().includes(term.toLowerCase())),
      );
    }
  }, [products, term]);

  let content;
  if (localProducts.length > 0) {
    content = localProducts.map((product) => (
      <ProductCard addToCart={addToCart} product={product} key={product.id} />
    ));
  } else if (error) {
    content = <div>an error ocurred</div>;
  } else if (localProducts.length === 0) {
    content = <div> No products found!</div>;
  }

  const productsAmount =
    localProducts.length === 1 ? `1 Product` : `${localProducts.length} Products`;

  return (
    <main className="my-8" data-testid="product-list">
      <Search doSearch={(term) => setTerm(term)} />
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Wrist Watch</h3>
        <span className="mt-3 text-sm text-gray-500">{productsAmount}</span>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
          {content}
        </div>
      </div>
    </main>
  );
}
