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
    public class AppsDataProvider : IAppsDataProvider
    {
        // Get a reference to the App Settings defined in appsettings.json
        private readonly IConfiguration _config;

        public AppsDataProvider(IConfiguration config)
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

        // GET APPS
        public async Task<List<App>> GetApps()
        {
            // For development, use direct SQL so we can modify the query anytime with ease
            string sql = "SELECT * FROM Apps";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.QueryAsync<App>(sql);
                return result.ToList();
            }

            // For Production, it is better to use Stored Procedures
            /*using (var sqlConnection = new SqlConnection(_connectionString))
            {
                await sqlConnection.OpenAsync();

                return await sqlConnection.QueryAsync<User>(
                    "spGetApps",
                    null,
                    commandType: CommandType.StoredProcedure);
            }*/
        }

        // GET APP BY ID
        public async Task<App> GetApp(int appId)
        {
            string sql = "SELECT * FROM Apps WHERE Id = @AppId";

            using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var result = await dbConnection.QueryFirstOrDefaultAsync<App>(sql, new { AppId = appId });
                return result;
            }

            // STORED PROCEDURE VERSION
            /*using (var dbConnection = DbConnection)
            {
                await dbConnection.OpenAsync();

                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("@AppId", appId);

                return await dbConnection.QuerySingleOrDefaultAsync<User>(
                    "spGetApp",
                    dynamicParameters,
                    commandType: CommandType.StoredProcedure);
            }*/
        }
    }
}
