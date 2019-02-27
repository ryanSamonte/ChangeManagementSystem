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

        [Required]
        public bool CanImplement { get; set; }
    }
}