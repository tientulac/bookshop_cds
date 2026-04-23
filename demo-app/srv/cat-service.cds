using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(odata:'/browse') {
  entity Books as projection on my.Books;

  function booksPaginated(limit: Integer default 5) returns array of Books;

  function submitOrder(book: Books:ID, quantity: Integer) returns Books;

  function insertBook(title: String, descr: String, stock: Integer, price: Decimal, currency_code: String) returns Books;
}