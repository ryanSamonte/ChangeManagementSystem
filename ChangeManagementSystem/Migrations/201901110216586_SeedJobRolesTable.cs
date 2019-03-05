namespace ChangeManagementSystem.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class SeedJobRolesTable : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO JobRoleModels VALUES('Business Analyst')");
            Sql("INSERT INTO JobRoleModels VALUES('Business Applications Development Manager')");
            Sql("INSERT INTO JobRoleModels VALUES('Software Development Supervisor')");
            Sql("INSERT INTO JobRoleModels VALUES('Head: IT and ISD')");
        }

        public override void Down()
        {
        }
    }
}