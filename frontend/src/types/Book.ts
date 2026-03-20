/** Matches backend Book model. Uses camelCase to align with .NET JSON serialization. */
export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}
