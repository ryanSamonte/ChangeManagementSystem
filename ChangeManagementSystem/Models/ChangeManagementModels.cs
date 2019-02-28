using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChangeManagementSystem.Models
{
    public class ChangeManagementModels
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string CmdNo { get; set; }

        [Required(ErrorMessage = "Change objective is required")]
        [StringLength(2000)]
        [Display(Name = "OBJECTIVE")]
        public string ChangeObjective { get; set; }

        [Required(ErrorMessage = "Change type is required")]
        [Display(Name = "TYPE")]
        public int ChangeType { get; set; }

        [Required(ErrorMessage = "Change requirement is required")]
        [Display(Name = "MANAGEMENT REQUIREMENT")]
        [StringLength(2000)]
        public string ChangeRequirements { get; set; }

        [Required(ErrorMessage = "Affected area is required")]
        [Display(Name = "AFFECTED AREAS")]
        public string AffectedAreas { get; set; }

        [Required(ErrorMessage = "Change evaluation is required")]
        [Display(Name = "REQUEST EVALUATION")]
        public int ChangeEvaluation { get; set; }

        [Required(ErrorMessage = "Target implementation date is required")]
        [Display(Name = "TARGET IMPLEMENTATION DATE AND TIME")]
        public DateTime TargetImplementation { get; set; }

        [Required(ErrorMessage = "Requestor is required")]
        [Display(Name = "REQUESTOR")]
        public string RequestorId { get; set; }

        [ForeignKey("RequestorId")]
        public virtual ApplicationUser ApplicationUser { get; set; }

        [Required(ErrorMessage = "Sign-off is required")]
        [Display(Name = "CHANGE MANAGEMENT SIGN-OFF")]
        public string SignOff { get; set; }

        public bool IsImplemented { get; set; }

        public bool IsApproved { get; set; }

        public DateTime? ImplementedAt { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }
    }

    public enum changeObjective
    {
        CorrectivePatch = 1,
        NewFunction = 2,
    }
}