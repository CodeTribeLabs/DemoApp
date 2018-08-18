using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using DemoServer.DataProviders;
using DemoServer.Models;

namespace DemoServer.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserDataProvider _dataProvider;

        public UserController(IUserDataProvider dataProvider)
        {
            this._dataProvider = dataProvider;
        }

        [Authorize]
        [HttpGet]
        public async Task<List<User>> Get()
        {
            return await this._dataProvider.GetUsers();
        }

        [HttpGet("{id}")]
        public async Task<User> Get(int UserId)
        {
            return await this._dataProvider.GetUser(UserId);
        }

        [HttpPut("{id}")]
        public async Task Put(int UserId, [FromBody]User user)
        {
            await this._dataProvider.UpdateUser(user);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int UserId)
        {
            await this._dataProvider.DeleteUser(UserId);
        }
    }
}