using System.Security.Claims;
using Microsoft.Extensions.Logging;

namespace NotePadApi.Services
{
    //this service is responsible for the business logic of the user service
    //it is used to get the user id from the claims principal
    //it is used to log errors, warnings, and information about the user service

    public class UserService : IUserService
    {
        //this will be used to log errors, warnings, and information about the user service
        private readonly ILogger<UserService> _logger;

        public UserService(ILogger<UserService> logger)
        {
            _logger = logger;
        }

        public string GetUserId(ClaimsPrincipal? user)
        {
            //get the user id from the claims principal
            //ClaimTypes.NameIdentifier is the type of the claim that contains the user id
            var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            
            //get the user id from the claims principal and log it
            _logger.LogInformation("User ID: {userId} found", userId);
            
            return userId;
        }

    }
}
