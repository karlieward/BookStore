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
    public IActionResult GetBooks([FromQuery] int pageSize = 10, [FromQuery] int pageNum = 1)
    {
        var totalNumBooks = _context.Books.Count();
        var books = _context.Books
            .OrderBy(b => b.Title)
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { books, totalNumBooks });
    }
}
