namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsApprovedFieldIntoChangeManagementModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ChangeManagementModels", "IsApproved", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ChangeManagementModels", "IsApproved");
        }
    }
}
