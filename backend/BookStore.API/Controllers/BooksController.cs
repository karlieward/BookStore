using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookStore.API.Data;

namespace BookStore.API.Controllers;

[ApiController]
[Route("[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookStoreContext _context;

    public BooksController(BookStoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetBooks(
        [FromQuery] int pageSize = 5,
        [FromQuery] int pageNum = 1,
        [FromQuery] string? sortOrder = null)
    {
        sortOrder ??= Request.Query["sortOrder"].FirstOrDefault() ?? "asc";
        var totalNumBooks = _context.Books.Count();
        var isDesc = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase);

        var books = isDesc
            ? _context.Books.OrderByDescending(b => b.Title)
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList()
            : _context.Books.OrderBy(b => b.Title)
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

        return Ok(new { books, totalNumBooks });
    }
}
