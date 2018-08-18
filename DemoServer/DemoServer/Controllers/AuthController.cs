using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using DemoServer.Contexts;
using DemoServer.DataProviders;
using DemoServer.Models;

namespace DemoServer.Controllers
{
    public class SignUpCredentials
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string Digest { get; set; }
    }

    public class LoginCredentials
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Digest { get; set; }
    }

    [Route("auth/")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        readonly UserManager<IdentityUser> _userManager;
        readonly SignInManager<IdentityUser> _signInManager;
        readonly BoardDbContext _boardDbContext;
        readonly FeedDbContext _feedDbContext;

        private UserAuthContext _userAuthContext;
        private IUserDataProvider _dataProvider;

        public AuthController(
            UserAuthContext userAuthContext, 
            IUserDataProvider dataProvider, 
            UserManager<IdentityUser> userManager, 
            SignInManager<IdentityUser> signInManager,
            BoardDbContext boardDbContext,
            FeedDbContext feedDbContext)
        {
            this._boardDbContext = boardDbContext;
            this._feedDbContext = feedDbContext;
            this._userAuthContext = userAuthContext;
            this._dataProvider = dataProvider;
            this._userManager = userManager;
            this._signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] SignUpCredentials credentials)
        {
            // Check if the user already exists in the database
            UserMap userMap = await this._dataProvider.GetUserMapByUserName(credentials.Email);

            // If user already exists in the database, return a BadRequest error
            if (userMap != null)
                return BadRequest();

            // Attempt to create a new Identity User using the provided credentials
            var identityUser = new IdentityUser { UserName = credentials.Email, Email = credentials.Email };

            var result = await _userManager.CreateAsync(identityUser, credentials.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _signInManager.SignInAsync(identityUser, isPersistent: false);

            // Create a Security Token
            string authToken = _userAuthContext.CreateAuthToken(identityUser);

            // Set the User class
            User user = new User
            {
                UserName = credentials.Email,
                Email = credentials.Email,
                Password = credentials.Password,
                FirstName = credentials.FirstName,
                LastName = credentials.LastName,
                AuthToken = authToken,
                GameCredits = 10000,
                GameCurrency = 100,
                Status = 1
            };

            // Create the user and add mappings in the database
            await this._dataProvider.AddUser(user);

            User createdUser = await this._dataProvider.GetUserByUserName(credentials.Email);
            user.AcctId = createdUser.AcctId;

            await this._dataProvider.AddUserMap(user.Email, user.AcctId);
            await this._dataProvider.AddIdentityMap(identityUser.Id, user.AcctId);

            // Overwrite the password to hold the Identity Id
            user.Password = identityUser.Id;
            user.TotalBoards = 0;
            user.TotalComments = 0;

            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginCredentials credentials)
        {
            // Check if the user already exists in the database
            UserMap userMap = await this._dataProvider.GetUserMapByUserName(credentials.Email);
            User user = null;
            IdentityUser identityUser;

            if (userMap != null)
            {   // User Map exists, fetch the user's account from the database
                user = await this._dataProvider.GetUser(userMap.AcctId);
            }

            // Attempt to authenticate the user using Identity Framework
            var result = await _signInManager.PasswordSignInAsync(credentials.Email, credentials.Password, false, false);

            if (!result.Succeeded)
            {   // If user doesn't exist, return a Bad Request
                if(userMap == null)
                    return BadRequest();
                else
                {   // User exist in the database but not yet existing in the in-memory DB
                    if (user.Password == credentials.Password)
                    {   // If the saved password and credential password is the same, attempt to create a new Identity User
                        identityUser = new IdentityUser { UserName = credentials.Email, Email = credentials.Email };

                        var createResult = await _userManager.CreateAsync(identityUser, credentials.Password);

                        if (!createResult.Succeeded)
                            return BadRequest(createResult.Errors);

                        await _signInManager.SignInAsync(identityUser, isPersistent: false);
                    }
                    else
                        return BadRequest();
                }
            }
            else
                identityUser = await _userManager.FindByEmailAsync(credentials.Email);

            if (userMap == null)
            {   // User Map does not exist, return a NotFound error
                return NotFound();
            }

            // Update the Identity Map
            await this._dataProvider.UpdateIdentityMap(identityUser.Id, user.AcctId);

            // Overwrite the password to hold the Identity Id
            user.Password = identityUser.Id;
            // Populate user stats
            PopulateUserStats(user);

            return Ok(user);
        }

        [HttpPost("silentlogin")]
        public async Task<IActionResult> SilentLogin([FromBody] LoginCredentials credentials)
        {
            // Check if the user already exists in the database
            UserMap userMap = await this._dataProvider.GetUserMapByUserName(credentials.Email);
            User user = null;

            if (userMap != null)
            {   // User Map exists, fetch the user's account from the database

                // TO DO : Validate user's credentials here via Identity Framework (Claims) before proceeding

                user = await this._dataProvider.GetUser(userMap.AcctId);

                if (user != null)
                {
                    PopulateUserStats(user);
                }
                else
                    return BadRequest();

                // Overwrite the password to hold the Identity Id
                //user.Password = identityUser.Id;
                user.Password = "";

                return Ok(user);
            }
            else
                return BadRequest();            
        }

        private void PopulateUserStats(User user)
        {
            user.TotalBoards = _boardDbContext.Boards.Where(b => b.AcctId == user.AcctId).Count<Board>();
            user.TotalComments = _feedDbContext.Feeds.Where(f => f.AcctId == user.AcctId).Count<Feed>();
        }
    }
}