namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SeedAspNetRoles : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO AspNetRoles VALUES (1, 'Administrator')");
            Sql("INSERT INTO AspNetRoles VALUES (2, 'User')");
        }
        
        public override void Down()
        {
        }
    }
}
