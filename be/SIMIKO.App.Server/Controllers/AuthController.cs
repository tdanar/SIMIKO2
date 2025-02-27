using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SIMIKO.App.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly LdapAuthService _ldapAuthService;
    private readonly UserService _userService;
    private readonly IConfiguration _config;

    public AuthController(LdapAuthService ldapAuthService, UserService userService, IConfiguration config)
    {
        _ldapAuthService = ldapAuthService;
        _userService = userService;
        _config = config;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (_ldapAuthService.Authenticate("kemenkeu\\"+request.Email, request.Password))
        {
            var user = _userService.GetUserByUsername(request.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "User tidak terdaftar di sistem." });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token, username = user.Username,nip = user.NIP, displayname = user.FullName, role = user.Role });
        }
        return Unauthorized(new { message = "Login gagal" });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _config["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new ArgumentNullException("Jwt:Key", "JWT key is not configured.");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            new List<Claim> { new Claim(ClaimTypes.Name, user.Username) },
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
