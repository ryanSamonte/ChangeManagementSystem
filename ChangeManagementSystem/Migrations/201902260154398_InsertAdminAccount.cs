namespace ChangeManagementSystem.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class InsertAdminAccount : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO AspNetUsers (Id, Email, EmailConfirmed, PasswordHash, SecurityStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEndDateUtc, LockoutEnabled, AccessFailedCount, UserName, Lastname, Firstname, JobRoleId) VALUES ('408g905c-8g14-565b-0d54-21e431c21b12', 'ecpayadmin', 0, 'AMzv85+Jj8GPRKPjrIPr873pF7qCM1sLO2ev/vsD8+Yxbhx5x38A+DBaIE92oAdF9A==', 'e84e7caa-5d80-41fa-a02a-6863b8577a1e', NULL, 0, 0, NULL, 0, 0, 'ecpayadmin', 'Inc.', 'ECPay', 1)");
            Sql("INSERT INTO AspNetUserRoles (UserId, RoleId) VALUES ('408g905c-8g14-565b-0d54-21e431c21b12', '1')");
        }

        public override void Down()
        {
        }
    }
}