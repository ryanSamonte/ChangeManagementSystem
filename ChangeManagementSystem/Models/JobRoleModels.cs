using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace ChangeManagementSystem.Models
{
    public class JobRoleModels
    {
        [Required]
        [Key]
        public int Id { get; set; }

        [Required]
        public string JobRoleName { get; set; }
    }
}