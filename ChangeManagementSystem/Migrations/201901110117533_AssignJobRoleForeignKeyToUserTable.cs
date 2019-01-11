namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AssignJobRoleForeignKeyToUserTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.JobRoleModels",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        JobRoleName = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.AspNetUsers", "JobRoleId", c => c.Int(nullable: false));
            CreateIndex("dbo.AspNetUsers", "JobRoleId");
            AddForeignKey("dbo.AspNetUsers", "JobRoleId", "dbo.JobRoleModels", "Id", cascadeDelete: true);
            DropColumn("dbo.AspNetUsers", "JobRole");
        }
        
        public override void Down()
        {
            AddColumn("dbo.AspNetUsers", "JobRole", c => c.Int(nullable: false));
            DropForeignKey("dbo.AspNetUsers", "JobRoleId", "dbo.JobRoleModels");
            DropIndex("dbo.AspNetUsers", new[] { "JobRoleId" });
            DropColumn("dbo.AspNetUsers", "JobRoleId");
            DropTable("dbo.JobRoleModels");
        }
    }
}
