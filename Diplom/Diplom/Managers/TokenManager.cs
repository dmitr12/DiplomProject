using Diplom.Interfaces;
using Diplom.Models.UserModels;
using Diplom.Utils;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Diplom.Managers
{
    public class TokenManager : IGeneratorToken
    {
        private readonly IOptions<AuthOptions> authenticateOptions;
        private const string claimRole = "role";
        public TokenManager(IOptions<AuthOptions> options)
        {
            authenticateOptions = options;
        }

        public string GenerateToken(User user)
        {
            var authenticateParameters = authenticateOptions.Value;
            var securityKey = authenticateParameters.GetSymmetricSecurityKey();
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
                {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Login),
                new Claim(claimRole, user.RoleId.ToString())
            };
            var token = new JwtSecurityToken(claims: claims, notBefore: DateTime.Now, expires: DateTime.Now.AddSeconds(authenticateParameters.TokenLifeTime),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
