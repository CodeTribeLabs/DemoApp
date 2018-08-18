using System.Collections.Generic;
using System.Threading.Tasks;
using DemoServer.Models;

namespace DemoServer.DataProviders
{
    public interface IAppsDataProvider
    {
        Task<List<App>> GetApps();

        Task<App> GetApp(int appId);
    }
}
