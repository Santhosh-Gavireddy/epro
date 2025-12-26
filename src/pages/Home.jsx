import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import api from '../utils/api';
import SEO from '../components/SEO';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [collections, setCollections] = useState([]);
  const [trendingStyles, setTrendingStyles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch new arrivals (mock or real)
    const fetchNewArrivals = async () => {
      try {
        const { data } = await api.get('/products?limit=4&sort=-createdAt&collection=New Arrival');
        setNewArrivals(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/feedback');
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchVisuals = async () => {
      try {
        const [heroRes, collectionRes, trendingRes, catRes] = await Promise.all([
          api.get('/visuals/hero'),
          api.get('/visuals/collections'),
          api.get('/visuals/trending'),
          api.get('/visuals/categories')
        ]);
        setHeroSlides(heroRes.data);
        setCollections(collectionRes.data);
        setTrendingStyles(trendingRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Error fetching visuals:', error);
      }
    };

    fetchNewArrivals();
    fetchReviews();
    fetchVisuals();
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        title="Home"
        description="Discover the latest trends in fashion. Shop our curated collections of men's, women's, and kids' clothing."
      />
      {/* Hero Section with Swiper */}
      <section className="h-screen relative">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          className="h-full w-full"
          key={heroSlides.length}
        >
          {heroSlides.length > 0 && heroSlides.map((slide) => (
            <SwiperSlide key={slide._id}>
              <div className="relative h-full w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl mb-8 font-light"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Link
                      to="/products"
                      className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-transform transform hover:scale-105"
                    >
                      Shop Collection
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Auto-scrolling Collections */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Curated Collections
          </motion.h2>
          <p className="text-gray-500">Explore our handpicked categories for every season.</p>
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop={true}
          className="px-4"
          key={collections.length}
        >
          {collections.map((collection, index) => (
            <SwiperSlide key={index}>
              <Link to={collection.link} className="block relative group overflow-hidden rounded-xl aspect-[3/4] cursor-pointer">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <h3 className="text-white text-xl font-bold">{collection.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Men, Women, Kids Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12 uppercase tracking-widest"
          >
            Shop By Category
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group h-96 overflow-hidden rounded-2xl cursor-pointer"
              >
                <Link to={`/products?search=${category.name}`} className="block w-full h-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-8 left-8">
                    <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                    <span className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                      Shop Now <FaArrowRight />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-12 uppercase tracking-widest"
          >
            Trending Styles
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            {trendingStyles.slice(0, 4).map((style, index) => (
              <motion.div
                key={style._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`relative group overflow-hidden rounded-2xl ${index === 0 ? 'md:col-span-2 md:row-span-2' :
                    index === 1 ? 'md:col-span-2' : ''
                  }`}
              >
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <h3 className="text-4xl font-bold text-white uppercase tracking-wider">{style.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">New Arrivals</h2>
              <p className="text-gray-500">Fresh styles just for you.</p>
            </motion.div>
            <Link to="/products?sort=newest" className="text-black font-medium hover:underline flex items-center gap-2">
              View All <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Skeletons while loading
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
            ) : newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-full bg-white text-black py-3 rounded-md font-medium shadow-lg hover:bg-gray-50">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
                  <p className="text-gray-500">₹{product.price}</p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No new arrivals at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews (Trendy Carousel) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-16"
          >
            What Our Customers Say
          </motion.h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
            className="pb-12"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id}>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="text-gray-300 mb-4">
                    <FaQuoteLeft size={30} />
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <FaStar key={i} size={14} className={i < (review.rating || 5) ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                      {review.name.charAt(0)}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;
