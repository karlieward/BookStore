# BookStore - IS 413 Mission #11

An online bookstore web app built with ASP.NET Core API and React (TypeScript). Displays books from a SQLite database with pagination and sorting.

## Requirements Met

- **Database fields** (all required): Title, Author, Publisher, ISBN, Classification, Category, Number of Pages, Price
- **Component** lists book information in Bootstrap-styled cards
- **Pagination**: 5 books per page by default, user can change results per page (5, 10, 25, 50)
- **Sort by title**: User can sort books A-Z or Z-A
- **Bootstrap** styling throughout

## How to Run

### Backend
```bash
cd backend/BookStore.API
dotnet run
```
API runs on http://localhost:5003 (or the port shown in the terminal).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 in your browser.

**Note:** Both backend and frontend must be running for the app to display books.
