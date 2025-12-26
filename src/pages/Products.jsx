import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { useLocation } from 'react-router-dom';
import { toast } from '../utils/notification';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams(location.search);
        const searchQuery = searchParams.get('search');

        // Build filters for backend
        const backendFilters = {};
        for (const [key, value] of searchParams.entries()) {
          if (['category', 'collection', 'targetAudience', 'type', 'sort'].includes(key)) {
            backendFilters[key] = value;
          }
        }

        // Fetch up to 100 products to emulate 'view all' for client-side filtering
        const params = { ...backendFilters, limit: 100 };
        const res = await api.get('/products', { params });

        let productsData = [];
        if (res.data && Array.isArray(res.data.products)) {
          // New paginated format
          productsData = res.data.products;
        } else if (Array.isArray(res.data)) {
          // Old array format fallback
          productsData = res.data;
        }

        setProducts(productsData);

        // Apply local search filtering if needed
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const searchResults = productsData.filter(
            (p) =>
              (p.title || '').toLowerCase().includes(q) ||
              (p.slug || '').toLowerCase().includes(q) ||
              (p.description || '').toLowerCase().includes(q)
          );
          setFiltered(searchResults);
        } else {
          setFiltered(productsData);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch products.');
        toast.error('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [location.search]);

  const handleSort = (value) => {
    setSort(value);
    let next = [...filtered];
    if (value === 'price-asc') next.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (value === 'price-desc') next.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (value === 'latest') next = [...products]; // Reset to original order (assuming API returns latest)
    setFiltered(next);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500 uppercase tracking-widest">Loading...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
        <div>
          <h1 className="text-3xl font-normal uppercase tracking-widest text-black mb-2">Shop</h1>
          <p className="text-sm text-gray-500">Showing {filtered.length} results</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm uppercase tracking-wider text-gray-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="border-none bg-transparent text-sm font-medium uppercase tracking-wider focus:ring-0 cursor-pointer hover:text-gray-600"
          >
            <option value="latest">Latest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {filtered.length ? (
          filtered.map((item) => (
            <ProductCard key={item._id || item.id} product={item} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
