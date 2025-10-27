using System.Security.Claims;

namespace NotePadApi.Services
{
    public interface IUserService
    {
       string GetUserId(ClaimsPrincipal? user);
    }
}