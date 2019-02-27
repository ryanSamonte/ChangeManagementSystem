namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCanImplementFieldIntoJobRoleModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.JobRoleModels", "CanImplement", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.JobRoleModels", "CanImplement");
        }
    }
}
