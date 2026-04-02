using Microsoft.EntityFrameworkCore;
using BookStore.API.Data;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("BookstoreConnection")
    ?? throw new InvalidOperationException("Connection string 'BookstoreConnection' was not found.");

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
    db.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// CORS: allow the Azure Static Web App to call this API (and keep local dev working).
// This project is used for coursework; permissive CORS avoids "empty UI" due to blocked fetches.
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

    if (string.IsNullOrWhiteSpace(dataSource) || Path.IsPathRooted(dataSource))
    {
        return connectionString;
    }

    var contentRoot = AppContext.BaseDirectory;
    var packagedDbPath = Path.Combine(contentRoot, dataSource);

    var azureHome = Environment.GetEnvironmentVariable("HOME");
    var writableRoot = string.IsNullOrWhiteSpace(azureHome)
        ? contentRoot
        : Path.Combine(azureHome, "data");

    Directory.CreateDirectory(writableRoot);

    var writableDbPath = Path.Combine(writableRoot, Path.GetFileName(dataSource));

    if (!File.Exists(writableDbPath) && File.Exists(packagedDbPath))
    {
        File.Copy(packagedDbPath, writableDbPath);
    }

    builder.DataSource = writableDbPath;
    return builder.ToString();
}
