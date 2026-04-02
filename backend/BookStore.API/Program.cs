using Microsoft.EntityFrameworkCore;
using BookStore.API.Data;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("BookstoreConnection")
    ?? throw new InvalidOperationException("Connection string 'BookstoreConnection' was not found.");

// Resolve the SQLite file to a location that also works after Azure deployment.
var resolvedConnectionString = ResolveSqliteConnectionString(connectionString);

// Add services to the container.
// DbContext uses BookstoreConnection from appsettings.json
builder.Services.AddDbContext<BookStoreContext>(options =>
    options.UseSqlite(resolvedConnectionString));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BookStoreContext>();
    // Create the database file/tables the first time the app starts.
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// Allow the frontend site to call this API from a different domain.
app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod());
app.UseAuthorization();
app.MapControllers();

app.Run();

static string ResolveSqliteConnectionString(string connectionString)
{
    var builder = new SqliteConnectionStringBuilder(connectionString);
    var dataSource = builder.DataSource;

    // If the path is already absolute, leave it alone.
    if (string.IsNullOrWhiteSpace(dataSource) || Path.IsPathRooted(dataSource))
    {
        return connectionString;
    }

    var contentRoot = AppContext.BaseDirectory;
    var packagedDbPath = Path.Combine(contentRoot, dataSource);

    var azureHome = Environment.GetEnvironmentVariable("HOME");
    // Azure App Service gives us a writable HOME/data folder.
    var writableRoot = string.IsNullOrWhiteSpace(azureHome)
        ? contentRoot
        : Path.Combine(azureHome, "data");

    Directory.CreateDirectory(writableRoot);

    var writableDbPath = Path.Combine(writableRoot, Path.GetFileName(dataSource));

    // Copy the seeded database once so Azure starts with book data.
    if (!File.Exists(writableDbPath) && File.Exists(packagedDbPath))
    {
        File.Copy(packagedDbPath, writableDbPath);
    }

    // Point EF Core at the writable database file.
    builder.DataSource = writableDbPath;
    return builder.ToString();
}
