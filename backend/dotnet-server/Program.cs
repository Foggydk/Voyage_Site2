using server;

var builder = WebApplication.CreateBuilder(args);

// CORS — чтобы страницы сайта могли обращаться к API
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();

// Раздаём статические файлы из папки public (на уровень выше server/)
var publicPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "public"));
if (Directory.Exists(publicPath))
{
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(publicPath) });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(publicPath) });
}

// ===== API =====

// Регистрация
app.MapPost("/api/register", (RegisterRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Name) ||
        string.IsNullOrWhiteSpace(req.Email) ||
        string.IsNullOrWhiteSpace(req.Password))
    {
        return Results.BadRequest(new { error = "Заполните все поля" });
    }

    if (req.Password.Length < 6)
    {
        return Results.BadRequest(new { error = "Пароль должен быть минимум 6 символов" });
    }

    if (UserStore.EmailExists(req.Email))
    {
        return Results.BadRequest(new { error = "Пользователь с таким email уже существует" });
    }

    UserStore.Add(new User
    {
        Name = req.Name,
        Email = req.Email,
        Password = req.Password
    });

    return Results.Ok(new { message = "Регистрация успешна" });
});

// Вход
app.MapPost("/api/login", (LoginRequest req) =>
{
    var user = UserStore.Find(req.Email, req.Password);
    if (user == null)
        return Results.BadRequest(new { error = "Неверный email или пароль" });

    return Results.Ok(new { name = user.Name, email = user.Email });
});

app.Run();

// ===== DTO =====
public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);