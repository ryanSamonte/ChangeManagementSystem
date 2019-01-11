using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChangeManagementSystem.Models
{
    public class AffectedAreasModels
    {

        public int Id { get; set; }

        public string CmdNo { get; set; }

        public string ChangeObjective { get; set; }


        public int ChangeType { get; set; }

        public string ChangeRequirements { get; set; }


        public string AffectedAreas { get; set; }


        public int ChangeEvaluation { get; set; }

        public DateTime TargetImplementation { get; set; }


        public string RequestorName { get; set; }

        public string RequestorRole { get; set; }

        public string SignOff { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime DeletedAt { get; set; }

        public string Application { get; set; }

        //public string Database { get; set; }
        //public string Server { get; set; }
    }
}