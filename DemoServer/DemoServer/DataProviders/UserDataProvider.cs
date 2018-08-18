using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

using DemoServer.Models;

namespace DemoServer.DataProviders
{
    public class UserDataProvider : IUserDataProvider
    {
        // Get a reference to the App Settings defined in appsettings.json
        private readonly IConfiguration _config;

        public UserDataProvider(IConfiguration config)
        {
            _config = config;
        }

        public SqlConnection DbConnection
        {
            get
            {
                // Get the local DB Connection string from appsettings.json
                return new SqlConnection(_config.GetConnectionString("LocalDbConnectionString"));
            }
        }

        // GET USERS
        public async Task<List<User>> GetUsers()
        {
            // For development, use direct SQL so we can modify the query anytime with ease
            string sql = "SELECT * FROM Users";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.QueryAsync<User>(sql);
                return result.ToList();
            }

            // For Production, it is better to use Stored Procedures
            /*using (var sqlConnection = new SqlConnection(_connectionString))
            {
                await sqlConnection.OpenAsync();

                return await sqlConnection.QueryAsync<User>(
                    "spGetUsers",
                    null,
                    commandType: CommandType.StoredProcedure);
            }*/
        }

        // GET USER BY ID
        public async Task<User> GetUser(int userId)
        {
            string sql = "SELECT * FROM Users WHERE AcctId = @AcctId";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.QueryFirstOrDefaultAsync<User>(sql, new { AcctId = userId });
                return result;
            }

            // STORED PROCEDURE VERSION
            /*using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@Id", userId);

                return await dbConnection.QuerySingleOrDefaultAsync<User>(
                    "spGetUser",
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure);
            }*/
        }

        // GET USER BY USERNAME
        public async Task<User> GetUserByUserName(string userName)
        {
            string sql = "SELECT * FROM Users WHERE UserName = @UserName";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.QueryFirstOrDefaultAsync<User>(sql, new { UserName = userName });
                return result;
            }
        }

        // GET USER BY ID
        public async Task<UserMap> GetUserMapByUserName(string userName)
        {
            string sql = "SELECT * FROM UserMaps WHERE Email = @UserName";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.QueryFirstOrDefaultAsync<UserMap>(sql, new { UserName = userName });
                return result;
            }
        }

        // ADD USER
        public async Task AddUser(User user)
        {
            string sql = "INSERT INTO Users " +
                         "(UserName,Email,Password,FirstName,LastName,AuthToken,GameCredits,GameCurrency,Status) VALUES " + 
                         "(@UserName,@Email,@Password,@FirstName,@LastName,@AuthToken,@GameCredits,@GameCurrency,@Status)";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.ExecuteAsync(sql, new
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Password = user.Password,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    AuthToken = user.AuthToken,
                    GameCredits = user.GameCredits,
                    GameCurrency = user.GameCurrency,
                    Status = user.Status
                });
            }

            // STORED PROCEDURE VERSION

            /*using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@AcctIdId", user.AcctId);
                dynamicParameters.Add("@UserName", user.UserName);
                dynamicParameters.Add("@Email", user.Email);
                dynamicParameters.Add("@Password", user.Password);
                dynamicParameters.Add("@FirstName", user.FirstName);
                dynamicParameters.Add("@LastName", user.LastName);
                dynamicParameters.Add("@Status", user.Status);

                await dbConnection.ExecuteAsync(
                    "spAddUser",
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure);
            }*/
        }

        public async Task AddUserMap(string email, int acctId)
        {
            string sql = "INSERT INTO UserMaps " +
                         "(Email,AcctId) VALUES " +
                         "(@Email,@AcctId)";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.ExecuteAsync(sql, new
                {
                    Email = email,
                    AcctId = acctId
                });
            }
        }

        public async Task AddIdentityMap(string identityId, int acctId)
        {
            string sql = "INSERT INTO IdentityMaps " +
                         "(IdentityId,AcctId) VALUES " +
                         "(@IdentityId,@AcctId)";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.ExecuteAsync(sql, new
                {
                    IdentityId = identityId,
                    AcctId = acctId
                });
            }
        }

        public async Task UpdateUser(User user)
        {
            string sql = "UPDATE Users SET " +
                         "UserName=@UserName,Email=@Email,Password=@Password,FirstName=@FirstName,LastName=@LastName,AuthToken=@AuthToken,Status=@Status " +
                         "WHERE AcctId=@AcctId";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.ExecuteAsync(sql, new
                {
                    AcctId = user.AcctId,
                    UserName = user.UserName,
                    Email = user.Email,
                    Password = user.Password,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    AuthToken = user.AuthToken,
                    Status = user.Status
                });
            }
        }

        public async Task UpdateUserCredits(int userId, int deltaCredits, int deltaCurrency)
        {
            string sql = "UPDATE Users SET " +
                         "GameCredits=GameCredits" + ((deltaCredits>0) ? "+" : "-") +"@GameCredits, " +
                         "GameCurrency=GameCurrency" + ((deltaCurrency > 0) ? "+" : "-") + "@GameCurrency " +
                         "WHERE AcctId=@AcctId";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.ExecuteAsync(sql, new
                {
                    AcctId = userId,
                    GameCredits = Math.Abs(deltaCredits),
                    GameCurrency = Math.Abs(deltaCurrency)
                });

                //GameCredits = (deltaCredits > 0) ? "+" + deltaCredits.ToString() : deltaCredits.ToString(),
                    //GameCurrency = (deltaCurrency > 0) ? "+" + deltaCurrency.ToString() : deltaCurrency.ToString()
            }
        }

        public async Task UpdateIdentityMap(string identityId, int acctId)
        {
            string sql = "UPDATE IdentityMaps SET " +
                         "IdentityId=@IdentityId " +
                         "WHERE AcctId=@AcctId";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.ExecuteAsync(sql, new
                {
                    IdentityId = identityId,
                    AcctId = acctId
                });
            }
        }

        public async Task DeleteUser(int id)
        {
            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@Id", id);

                await dbConnection.ExecuteAsync(
                    "spDeleteUser",
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }
    }
}
