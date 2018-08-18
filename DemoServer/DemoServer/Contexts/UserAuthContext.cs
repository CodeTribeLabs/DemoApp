using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace DemoServer.Contexts
{
    /// <summary>
    /// Helper methods to authenticate users 
    /// </summary>
    /// 
    public class UserAuthContext
    {
        private SymmetricSecurityKey _signingKey;

        public UserAuthContext(IConfiguration config)
        {
            // Fetch API KEY defined in appsettings.json
            _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetValue<string>("AppApiKey")));
        }

        public SymmetricSecurityKey GetSigningKey()
        {
            return _signingKey;
        }

        public string CreateAuthToken(IdentityUser user)
        {
            // Create a signing credentials using the signing key
            var signingCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);

            // Create claims for user so that it can be included in the security token for decrypting and authentication purposes
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id)
            };

            // Create a new JWT Security Token for the Identity User
            var jwtToken = new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(signingCredentials: signingCredentials, claims: claims));

            return jwtToken;
        }
    }
}
