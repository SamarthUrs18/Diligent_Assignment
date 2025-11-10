import React, { useState, useMemo } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, User } from 'lucide-react';

// --- Mock Data ---
// In a real MERN stack app, this data would come from your MongoDB database via your Express API.
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Classic Tee',
    price: 24.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Classic+Tee',
    category: 'Apparel',
  },
  {
    id: 2,
    name: 'Leather Wallet',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Leather+Wallet',
    category: 'Accessories',
  },
  {
    id: 3,
    name: 'Canvas Backpack',
    price: 79.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Canvas+Backpack',
    category: 'Bags',
  },
  {
    id: 4,
    name: 'Stainless Steel Watch',
    price: 129.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Steel+Watch',
    category: 'Accessories',
  },
  {
    id: 5,
    name: 'Wireless Earbuds',
    price: 89.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Earbuds',
    category: 'Electronics',
  },
  {
    id: 6,
    name: 'Running Shoes',
    price: 109.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Running+Shoes',
    category: 'Footwear',
  },
  {
    id: 7,
    name: 'Coffee Mug',
    price: 14.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Coffee+Mug',
    category: 'Homeware',
  },
  {
    id: 8,
    name: 'Minimalist Lamp',
    price: 64.99,
    imageUrl: 'https://placehold.co/600x600/F8F8F8/333?text=Minimalist+Lamp',
    category: 'Homeware',
  },
];

// --- Utility Functions ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// --- React Components ---

/**
 * 1. Header Component
 * Displays the store name, auth buttons, and the cart icon.
 */
function Header({ onCartClick, cartItemCount, user, onSignInClick, onSignOut }) {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">E-Commerce Store</h1>
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-gray-700">Hi, {user.email.split('@')[0]}</span>
              <button
                onClick={onSignOut}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onSignInClick}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <User size={22} className="mr-1" />
              Sign In
            </button>
          )}
          <button
            onClick={onCartClick}
            className="relative text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={28} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

/**
 * 2. ProductCard Component
 * Displays individual product information and an "Add to Cart" button.
 */
function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-56 object-cover"
        onError={(e) => { e.target.src = 'https://placehold.co/600x600/F8F8F8/333?text=Image+Error'; }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1">{formatCurrency(product.price)}</p>
        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/**
 * 3. ProductList Component
 * Displays a grid of ProductCard components.
 */
function ProductList({ products, onAddToCart }) {
  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Our Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 4. SlidingCart Component
 * This is the sliding cart panel.
 */
function SlidingCart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-grow overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart size={48} className="mb-4" />
                <p className="text-lg">Your cart is empty.</p>
                <p className="text-sm">Start adding some products!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  Subtotal
                </span>
                <span className="text-lg font-semibold text-gray-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 hover:bg-green-700">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * 5. CartItem Component
 * A helper component for SlidingCart to display each item.
 */
function CartItem({ item, onUpdateQuantity, onRemoveItem }) {
  return (
    <li className="flex items-center py-4">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
        onError={(e) => { e.target.src = 'https://placehold.co/100x100/F8F8F8/333?text=Item'; }}
      />
      <div className="flex-grow ml-4">
        <h4 className="text-md font-semibold text-gray-800">{item.name}</h4>
        <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity === 1}
            className="p-1 border rounded-md text-gray-600 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="mx-3 font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 border rounded-md text-gray-600"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <button
        onClick={() => onRemoveItem(item.id)}
        className="ml-4 text-gray-500 hover:text-red-600"
        aria-label="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </li>
  );
}

/**
 * 6. AuthModal Component (NEW)
 * A modal for Sign In and Sign Up.
 */
function AuthModal({ isOpen, onClose, onLogin, onSignUp }) {
  const [authMode, setAuthMode] = useState('signIn'); // 'signIn' or 'signUp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'signUp') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      // In a real app, this would be an API call
      console.log('Signing up with:', email, password);
      onSignUp({ email }); // Pass dummy user
    } else {
      // In a real app, this would be an API call
      console.log('Signing in with:', email, password);
      onLogin({ email }); // Pass dummy user
    }
    
    // Reset form
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn');
    setError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };
  
  const handleClose = () => {
    // Reset form on close
    toggleAuthMode();
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal Panel */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-xl relative m-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {authMode === 'signIn' ? 'Sign In' : 'Sign Up'}
          </h2>

          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {authMode === 'signUp' && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 hover:bg-blue-700"
            >
              {authMode === 'signIn' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {authMode === 'signIn'
              ? "Don't have an account?"
              : 'Already have an account?'}
            <button
              onClick={toggleAuthMode}
              className="text-blue-600 hover:underline font-semibold ml-1"
            >
              {authMode === 'signIn' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
}


/**
 * 7. Footer Component
 * A simple footer for the page.
 */
function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-6 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} E-Commerce Store. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          This is a demo site. No real products or payments.
        </p>
      </div>
    </footer>
  );
}

/**
 * 8. Main App Component
 * This is the root component. It manages the global state.
 */
export default function App() {
  const [products] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // e.g., { email: 'user@example.com' }

  // --- Cart Logic Functions ---

  const handleAddToCart = (productToAdd) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productToAdd.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...productToAdd, quantity: 1 }];
      }
    });
    setIsCartOpen(true); // Open cart on add
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // --- Auth Logic Functions (Mock) ---
  
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };
  
  const handleSignUp = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // --- Render ---

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={cartItemCount}
        user={currentUser}
        onSignInClick={() => setIsAuthModalOpen(true)}
        onSignOut={handleLogout}
      />

      <main>
        <ProductList products={products} onAddToCart={handleAddToCart} />
      </main>

      <Footer />

      <SlidingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    </div>
  );
}