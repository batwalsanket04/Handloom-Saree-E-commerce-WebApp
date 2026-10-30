import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ProductCard } from '../product/ProductCard';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Spinner } from '../ui/Spinner';
import { cn } from '../../utils/cn';

const CategoryExplorer = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category/list');
      setCategories(res.data.categories || []);
    } catch (error) {
      console.log('Category fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Get unique categories from products as fallback
  const allCategories = ['All', ...categories.map((c) => c.name)].filter(Boolean);

  if (loading) {
    return (
      <Section spacing="md" background="gray">
        <Container>
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="md" background="gray">
      <Container>
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-heading-2 font-bold text-gray-900 mb-3">
            Explore Our Collection
          </h2>
          <p className="text-body-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of crafted pieces made to match your style and story.
          </p>
        </div>

        {/* Category Pills - Mobile horizontal scroll, Desktop grid */}
        <div className={cn(
          'gap-4 mb-8',
          'flex flex-wrap sm:justify-center'
        )}>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory((prev) => (prev === cat ? 'All' : cat))}
              className={cn(
                'px-5 py-2.5 rounded-button font-medium text-body-sm transition-all duration-fast',
                'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2',
                category === cat
                  ? 'bg-brand-600 text-white shadow-sm hover:bg-brand-700'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default CategoryExplorer;