using Microsoft.EntityFrameworkCore;

namespace BookStore.API.Data;

/// <summary>
/// EF Core DbContext for SQLite. Registered in Program.cs with BookstoreConnection.
/// </summary>
public class BookStoreContext : DbContext
{
    public BookStoreContext(DbContextOptions<BookStoreContext> options)
        : base(options) { }

    public DbSet<Book> Books { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Book>().ToTable("Books");
    }
}
