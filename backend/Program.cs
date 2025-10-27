using Microsoft.AspNetCore.Authentication.JwtBearer;
using NotePadApi.Auth;
using NotePadApi.Repositories;
using NotePadApi.Services;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app URL
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Configure Okta Authentication
var oktaConfig = builder.Configuration.GetSection("Okta").Get<OktaConfig>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = oktaConfig.OktaDomain;
    options.Audience = oktaConfig.Audience;
    
    // Proper validation
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = oktaConfig.OktaDomain,
        ValidAudience = oktaConfig.Audience
    };
    
    // Basic error handling
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully");
            return Task.CompletedTask;
        }
    };
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Register repositories and services
builder.Services.AddSingleton<INoteRepository, InMemoryNoteRepository>();
builder.Services.AddScoped<INoteService, NoteService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Use CORS before routing
app.UseCors("AllowReactApp");

// Add authentication middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); //map controller endpoints 

app.Run();