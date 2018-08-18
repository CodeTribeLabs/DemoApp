using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DemoServer.Models;

namespace DemoServer.DataProviders
{
    public interface IUserDataProvider
    {
        Task<List<User>> GetUsers();

        Task<User> GetUser(int userId);

        Task<User> GetUserByUserName(string userName);

        Task<UserMap> GetUserMapByUserName(string userName);

        Task AddUser(User user);

        Task AddUserMap(string email, int acctId);

        Task AddIdentityMap(string identityMap, int acctId);

        Task UpdateUser(User user);

        Task UpdateUserCredits(int userId, int deltaCredits, int deltaCurrency);

        Task UpdateIdentityMap(string identityMap, int acctId);

        Task DeleteUser(int userId);
    }
}
