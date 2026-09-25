import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedAdmin from "./components/ProtectedAdmin";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import FAQ from "./pages/FAQ";

import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (product) => {
    const numericPrice = Number(
      String(product.price)
        .replace("Rs. ", "")
        .replace(/,/g, "")
    );

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          numericPrice,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const placeOrder = () => {
    setCart([]);
    setOrderPlaced(true);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />

      <Routes>
        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* PROTECTED ADMIN ORDERS */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdmin>
              <AdminOrders />
            </ProtectedAdmin>
          }
        />

        {/* PROTECTED ADMIN PRODUCTS */}
        <Route
          path="/admin/products"
          element={
            <ProtectedAdmin>
              <AdminProducts />
            </ProtectedAdmin>
          }
        />

        {/* STORE */}
        <Route
          path="/"
          element={
            <Home onAddToCart={addToCart} />
          }
        />

        <Route
          path="/shop"
          element={
            <Shop onAddToCart={addToCart} />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              onAddToCart={addToCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              onRemove={removeFromCart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              onPlaceOrder={placeOrder}
              orderPlaced={orderPlaced}
            />
          }
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
