using System.Text.Json;

namespace server;

public static class UserStore
{
    private static readonly string FilePath =
        Path.Combine(AppContext.BaseDirectory, "users.json");

    private static readonly object _lock = new();

    public static List<User> GetAll()
    {
        if (!File.Exists(FilePath)) return new List<User>();
        var json = File.ReadAllText(FilePath);
        if (string.IsNullOrWhiteSpace(json)) return new List<User>();
        return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
    }

    public static void SaveAll(List<User> users)
    {
        var json = JsonSerializer.Serialize(users, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(FilePath, json);
    }

    public static bool EmailExists(string email)
    {
        lock (_lock)
        {
            return GetAll().Any(u => u.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }
    }

    public static void Add(User user)
    {
        lock (_lock)
        {
            var users = GetAll();
            users.Add(user);
            SaveAll(users);
        }
    }

    public static User? Find(string email, string password)
    {
        lock (_lock)
        {
            return GetAll().FirstOrDefault(u =>
                u.Email.Equals(email, StringComparison.OrdinalIgnoreCase) &&
                u.Password == password);
        }
    }
}