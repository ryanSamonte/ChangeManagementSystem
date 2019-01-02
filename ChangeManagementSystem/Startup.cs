using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ChangeManagementSystem.Startup))]
namespace ChangeManagementSystem
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
