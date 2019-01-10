namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddIsImplementedColumnIntoCMDTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ChangeManagementModels", "IsImplemented", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.ChangeManagementModels", "IsImplemented");
        }
    }
}
