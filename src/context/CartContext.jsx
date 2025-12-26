import { createContext, useContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage if available
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      // Use the most reliable ID available
      const id = product._id || product.id || product.slug;
      
      // Check if item already exists in cart
      const existingItemIndex = prev.findIndex(item => 
        (item._id === id) || (item.id === id) || (item.slug === id)
      );

      if (existingItemIndex >= 0) {
        // Create a new array to avoid direct state mutation
        const updatedItems = [...prev];
        // Get the existing item
        const existingItem = updatedItems[existingItemIndex];
        // Update the quantity by adding the new quantity to the existing one
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + (quantity || 1)
        };
        return updatedItems;
      }

      // If item doesn't exist, add it with the specified quantity
      return [...prev, { 
        ...product,
        _id: id, 
        id: id, // Ensure both _id and id are set
        name: product.title || product.name, // Ensure name is set
        title: product.title, // Ensure title is preserved
        category: product.category, // Ensure category is preserved
        image: product.images?.[0] || product.image, // Handle both images array and single image
        price: product.price, // Ensure price is included
        quantity: quantity || 1 
      }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => 
      prev.filter(item => 
        (item._id !== id) && (item.id !== id) && (item.slug !== id)
      )
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        (item._id === id || item.id === id || item.slug === id)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
