namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddImplementedAtColumnAtChangeManagementTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ChangeManagementModels", "ImplementedAt", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ChangeManagementModels", "ImplementedAt");
        }
    }
}
