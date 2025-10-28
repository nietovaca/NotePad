using System.Security.Claims;


//services layer interface for user service
//this layer is responsible for the business logic of the user service

namespace NotePadApi.Services
{
    public interface IUserService
    {
       string GetUserId(ClaimsPrincipal? user);
    }
}