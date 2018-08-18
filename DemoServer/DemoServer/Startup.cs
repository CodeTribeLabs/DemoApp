using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

using DemoServer.Contexts;
using DemoServer.DataProviders;
using DemoServer.Hubs;

namespace DemoServer
{
    public class Startup
    {
        private const string CORS_POLICY_NAME = "CORS";
        private const string IN_MEMORY_USER_DB = "UserDb";
        private const string IN_MEMORY_BOARD_DB = "BoardDb";
        private const string IN_MEMORY_FEED_DB = "FeedDb";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Allow CORS
            services.AddCors(options => options.AddPolicy(CORS_POLICY_NAME,
                builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                }));

            services.AddTransient<IUserDataProvider, UserDataProvider>();
            services.AddTransient<IAppsDataProvider, AppsDataProvider>();
            services.AddTransient<UserAuthContext>();

            // Use Entity Framework Core to store and manage users and do store boards and feeds
            services.AddDbContext<UserDbContext>(opt => opt.UseInMemoryDatabase(IN_MEMORY_USER_DB));
            services.AddDbContext<BoardDbContext>(opt => opt.UseInMemoryDatabase(IN_MEMORY_BOARD_DB));
            services.AddDbContext<FeedDbContext>(opt => opt.UseInMemoryDatabase(IN_MEMORY_BOARD_DB));

            // Use Identity Framework Core to authenticate users
            services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<UserDbContext>();

            // Setup checking of Authentication Header for all HTTP requests sent to the backend server
            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetValue<string>("AppApiKey")));
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters()
                {
                    IssuerSigningKey = signingKey,
                    ValidateAudience = false,   // must be set to TRUE on production server
                    ValidateIssuer = false,     // must be set to TRUE on production server
                    ValidateLifetime = false,   // must be set to TRUE on production server
                    ValidateIssuerSigningKey = true
                };
            });

            // Add SignalR support
            services.AddSignalR();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            // Use CORS with the policy name defined in ConfigureServices()
            app.UseCors(CORS_POLICY_NAME);

            // Enable header authentication on all HTTP requests sent to the backend server
            app.UseAuthentication();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            //else
            //{
            //    app.UseHsts();
            //}

            //app.UseHttpsRedirection();
            app.UseMvc();

            // SignalR Support
            app.UseSignalR(routes =>
            {
                routes.MapHub<MessageHub>("/hubs/msghub");
            });
        }
    }
}
