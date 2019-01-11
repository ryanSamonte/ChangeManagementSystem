namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddUserForeignKeyIntoCMDTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ChangeManagementModels", "RequestorId", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.ChangeManagementModels", "RequestorId");
            AddForeignKey("dbo.ChangeManagementModels", "RequestorId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
            DropColumn("dbo.ChangeManagementModels", "Requestor");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ChangeManagementModels", "Requestor", c => c.String(nullable: false));
            DropForeignKey("dbo.ChangeManagementModels", "RequestorId", "dbo.AspNetUsers");
            DropIndex("dbo.ChangeManagementModels", new[] { "RequestorId" });
            DropColumn("dbo.ChangeManagementModels", "RequestorId");
        }
    }
}
