import { db } from '../../db/index.js';
import { carts, cartItems, productVariants, products, productImages } from '../../db/schema/index.js';
import { eq, and, sql, asc, inArray } from 'drizzle-orm';

export class CartRepository {
  async getOrCreateCart(userId) {
    let [cart] = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);
    if (!cart) {
      [cart] = await db.insert(carts).values({ userId }).returning();
    }
    return cart;
  }

  async getCartItemsByUserId(userId) {
    const cart = await this.getOrCreateCart(userId);
    
    const items = await db.select({
      item: cartItems,
      variant: productVariants,
      product: products,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(cartItems.cartId, cart.id));

    const productIds = items.map(i => i.product.id);
    let allImages = [];
    let allVariants = [];
    if (productIds.length > 0) {
      allImages = await db.select().from(productImages)
        .where(inArray(productImages.productId, productIds))
        .orderBy(asc(productImages.sortOrder));
        
      allVariants = await db.select().from(productVariants)
        .where(inArray(productVariants.productId, productIds))
        .orderBy(asc(productVariants.size));
    }

    return {
      cartId: cart.id,
      items: items.map(i => {
        const images = allImages.filter(img => img.productId === i.product.id);
        const pVariants = allVariants.filter(v => v.productId === i.product.id && v.isActive);
        return {
          id: i.item.id,
          cartId: i.item.cartId,
          quantity: i.item.quantity,
          variant: i.variant,
          product: {
            ...i.product,
            image: images.length > 0 ? images[0].imageUrl : null,
            variants: pVariants
          }
        };
      })
    };
  }

  async upsertCartItem(cartId, variantId, quantity) {
    const [item] = await db.insert(cartItems)
      .values({ cartId, variantId, quantity })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.variantId],
        set: { quantity: sql`${cartItems.quantity} + ${quantity}`, updatedAt: new Date() }
      })
      .returning();
    return item;
  }

  async findCartItemByIdAndCartId(itemId, cartId) {
    const [item] = await db.select().from(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId))).limit(1);
    return item;
  }

  async updateCartItemQuantity(itemId, cartId, quantity) {
    const [updated] = await db.update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)))
      .returning();
    return updated;
  }

  async deleteCartItem(itemId, cartId) {
    await db.delete(cartItems).where(and(eq(cartItems.id, itemId), eq(cartItems.cartId, cartId)));
  }

  async clearCart(cartId) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }
}
