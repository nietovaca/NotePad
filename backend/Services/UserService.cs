using System.Security.Claims;

namespace NotePadApi.Services
{
    public class UserService : IUserService
    {
        public string GetUserId(ClaimsPrincipal? user)
        {
            return user?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }
    }
}
