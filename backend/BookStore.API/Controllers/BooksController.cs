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
        // Default to ascending title order if no sort is sent.
        sortOrder ??= Request.Query["sortOrder"].FirstOrDefault() ?? "asc";
        var isDesc = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase);

        // Start with all books, then add filters if the user selected any.
        IQueryable<Book> query = _context.Books.AsQueryable();

        if (categories is { Count: > 0 })
        {
            query = query.Where(b => categories.Contains(b.Category));
        }

        // Count after filtering so pagination matches the filtered result set.
        var totalNumBooks = query.Count();

        // Sort before paging so each page stays in the right order.
        var ordered = isDesc ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);

        // Return only the rows needed for the current page.
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
        // Send each category once so the filter list has no duplicates.
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
