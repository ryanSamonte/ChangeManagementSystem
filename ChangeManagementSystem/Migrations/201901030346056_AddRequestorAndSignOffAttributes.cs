namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRequestorAndSignOffAttributes : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ChangeManagementModels", "Requestor", c => c.String(nullable: false));
            AddColumn("dbo.ChangeManagementModels", "SignOff", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ChangeManagementModels", "SignOff");
            DropColumn("dbo.ChangeManagementModels", "Requestor");
        }
    }
}
