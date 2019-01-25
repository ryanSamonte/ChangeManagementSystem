namespace ChangeManagementSystem.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SetStringLengthOfObjectiveAndRequirementAttributes : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.ChangeManagementModels", "ChangeObjective", c => c.String(nullable: false, maxLength: 2000));
            AlterColumn("dbo.ChangeManagementModels", "ChangeRequirements", c => c.String(nullable: false, maxLength: 2000));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.ChangeManagementModels", "ChangeRequirements", c => c.String(nullable: false));
            AlterColumn("dbo.ChangeManagementModels", "ChangeObjective", c => c.String(nullable: false));
        }
    }
}
