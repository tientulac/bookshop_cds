import cds from "@sap/cds";

export class CatalogService extends cds.ApplicationService {
  async init() {
    const { Books } = this.entities;

    // ─── Validation hooks ────────────────────────────────────────────────────

    this.before(["CREATE", "UPDATE"], Books, (req) => {
      const { title, stock, price } = req.data as {
        title?: string;
        stock?: number;
        price?: number;
      };

      
      if (title !== undefined && !title?.trim()) {
        return req.reject(400, "Title must not be empty.");
      }
      if (stock !== undefined && stock < 0) {
        return req.reject(400, "Stock must be a non-negative number.");
      }
      if (price !== undefined && price < 0) {
        return req.reject(400, "Price must be a non-negative number.");
      }
    });

    // ─── Function: submitOrder ───────────────────────────────────────────────

    this.on("submitOrder", async (req) => {
      const { book: bookId, quantity } = req.data as {
        book: number;
        quantity: number;
      };

      if (!Number.isInteger(quantity) || quantity < 1) {
        return req.reject(400, "Quantity must be a positive integer.");
      }

      const book = await SELECT.one(Books, bookId);

      if (!book) {
        return req.reject(404, `Book ${bookId} not found.`);
      }

      const remaining = (book.stock ?? 0) - quantity;
      if (remaining < 0) {
        return req.reject(
          409,
          `Insufficient stock for book "${book.title}". Available: ${book.stock ?? 0}.`,
        );
      }

      await UPDATE(Books, bookId).with({ stock: remaining });

      return SELECT.one.from(Books).where({ ID: bookId });
    });

    // ─── Function: insertBook ──────────────────────────────────────────────

    this.on("insertBook", async (req) => {
      const { title, descr, stock, price, currency_code } = req.data as {
        title: string;
        descr?: string;
        stock?: number;
        price?: number;
        currency_code?: string;
      };

      if (!title?.trim()) {
        return req.reject(400, "Title must not be empty.");
      }
      if (stock !== undefined && stock < 0) {
        return req.reject(400, "Stock must be a non-negative number.");
      }
      if (price !== undefined && price < 0) {
        return req.reject(400, "Price must be a non-negative number.");
      }

      const maxIdRow = await SELECT.one.from(Books).columns("ID").orderBy("ID desc");
      const nextId = (maxIdRow?.ID ?? 0) + 1;

      await INSERT.into(Books).entries({
        ID: nextId,
        title: title.trim(),
        descr,
        stock: stock ?? 0,
        price: price ?? 0,
        currency_code,
      });

      return SELECT.one.from(Books).where({ ID: nextId });
    });

    // ─── Function: booksPaginated ────────────────────────────────────────────

    this.on("booksPaginated", async (req) => {
      const rawLimit = Number(req.data?.limit ?? 5);
      const limit = Number.isFinite(rawLimit)
        ? Math.max(1, Math.min(rawLimit, 100))
        : 5;

      return SELECT.from(Books)
        .columns(
          "ID",
          "title",
          "descr",
          "stock",
          "price",
          "currency_code",
          "author_ID",
          "genre_ID",
        )
        .limit(limit);
    });

    return super.init();
  }
}
