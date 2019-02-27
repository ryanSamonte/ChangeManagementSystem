namespace ChangeManagementSystem.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class SeedJobRolesTable : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO JobRoleModels VALUES('Business Analyst', false)");
            Sql("INSERT INTO JobRoleModels VALUES('Business Applications Development Manager', false)");
            Sql("INSERT INTO JobRoleModels VALUES('Software Development Supervisor', false)");
            Sql("INSERT INTO JobRoleModels VALUES('Head: IT and ISD', true)");
        }

        public override void Down()
        {
        }
    }
}