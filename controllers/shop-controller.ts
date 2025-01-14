import type { Request, Response } from 'express';
import { Product } from '../models/product';
import { Cart } from '../models/cart';

export function getIndex(_: Request, res: Response) {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.error(err.message));
}

export function getProducts(_: Request, res: Response) {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.error(err.message));
}

export function getProduct(req: Request, res: Response) {
  const { productId } = req.params;
  Product.findByPk(productId)
    .then((product) => {
      if (product) {
        res.render('shop/product-detail', {
          product,
          pageTitle: product.title,
          path: '/products',
        });
      } else {
        res.status(404).send('Product not found');
      }
    })
    .catch((err) => console.error(err.message));
}

export function getCart(_: Request, res: Response) {
  Cart.getCart((cart) => {
    interface cartProductType {
      productData: ProductType;
      qty: number;
    }
    const cartProducts: cartProductType[] = [];
    Product.fetchAll((products) => {
      for (let product of products) {
        const productData = cart.products.find(
          (cartProduct) => cartProduct.id === product.id
        );
        if (productData) {
          cartProducts.push({
            productData: product,
            qty: productData.quantity,
          });
        }
      }
      res.render('shop/cart', {
        products: cartProducts,
        totalPrice: cart.totalPrice,
        pageTitle: 'Your Cart',
        path: '/cart',
      });
    });
  });
}

export function addToCart(req: Request, res: Response) {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    product && Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
}

export function subtractToCart(req: Request, res: Response) {
  const { productId, productPrice } = req.body;

  Cart.subtractProduct(productId, productPrice);
  res.status(204).end();
}

export function removeFromCart(req: Request, res: Response) {
  const { productId, productPrice } = req.body;

  // Cart.subtractProduct(productId, productPrice);
  Cart.deleteProduct(productId, productPrice);
  res.status(204).end();
}

export function additionToCart(req: Request, res: Response) {
  const { productId, productPrice } = req.body;

  Cart.additionProduct(productId, productPrice);
  res.status(204).end();
}

export function getOrders(_: Request, res: Response) {
  res.render('shop/orders', {
    pageTitle: 'Your orders',
    path: '/orders',
  });
}

export function getCheckout(_: Request, res: Response) {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
}
