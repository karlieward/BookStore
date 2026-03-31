using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.API.Data;

namespace BookStore.API.Controllers;

/// <summary>
/// Books API: paginated book listing, category filter support, and category lookup.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookStoreContext _context;

    public BooksController(BookStoreContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns paginated, sortable list of books. Uses LINQ Skip/Take for pagination.
    /// </summary>
    [HttpGet]
    public IActionResult GetBooks(
        [FromQuery] int pageSize = 5,
        [FromQuery] int pageNum = 1,
        [FromQuery] string? sortOrder = null,
        [FromQuery] List<string>? categories = null)
    {
        // Fallback to query string in case model binding misses it
        sortOrder ??= Request.Query["sortOrder"].FirstOrDefault() ?? "asc";
        var isDesc = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase);

        // Mission 12: build the query dynamically so filtering + paging works together.
        IQueryable<Book> query = _context.Books.AsQueryable();

        if (categories is { Count: > 0 })
        {
            query = query.Where(b => categories.Contains(b.Category));
        }

        // Mission 12 (Crucial): total must be calculated AFTER filters are applied
        // so the frontend page button count adjusts based on selected categories.
        var totalNumBooks = query.Count();

        // OrderBy/OrderByDescending must run before Skip/Take for correct pagination
        var ordered = isDesc ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);

        var books = ordered
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { books, totalNumBooks });
    }

    /// <summary>
    /// Returns a distinct list of book categories.
    /// </summary>
    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        // Mission 12: distinct categories for the filter UI.
        var categories = _context.Books
            .Select(x => x.Category)
            .Distinct()
            .OrderBy(x => x)
            .ToList();

        return Ok(categories);
    }

    [HttpGet("{bookId:int}")]
    public IActionResult GetBookById([FromRoute] int bookId)
    {
        var book = _context.Books.FirstOrDefault(b => b.BookId == bookId);
        return book is null ? NotFound() : Ok(book);
    }

    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        _context.Books.Add(newBook);
        _context.SaveChanges();
        return Ok(newBook);
    }

    [HttpPut("UpdateBook/{bookId}")]
    public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
    {
        var existingBook = _context.Books.Find(bookId);

        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _context.Books.Update(existingBook);
        _context.SaveChanges();

        return Ok(existingBook);
    }

    [HttpDelete("DeleteBook/{bookId}")]
    public IActionResult DeleteBook(int bookId)
    {
        var book = _context.Books.Find(bookId);

        if (book == null)
        {
            return NotFound(new { message = "Book not found" });
        }

        _context.Books.Remove(book);
        _context.SaveChanges();

        return NoContent();
    }
}
