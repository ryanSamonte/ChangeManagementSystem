namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddNameAndJobRoleInUsersTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "Lastname", c => c.String(nullable: false));
            AddColumn("dbo.AspNetUsers", "Firstname", c => c.String(nullable: false));
            AddColumn("dbo.AspNetUsers", "JobRole", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "JobRole");
            DropColumn("dbo.AspNetUsers", "Firstname");
            DropColumn("dbo.AspNetUsers", "Lastname");
        }
    }
}
