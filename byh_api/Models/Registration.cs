using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace byh_api.Models
{
    public class Registration
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Imię jest wymagane")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email jest wymagany")]
        [EmailAddress(ErrorMessage = "Nieprawidłowy format email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Hasło jest wymagane")]
        [MinLength(6, ErrorMessage = "Hasło musi zawierać co najmniej 6 znaków")]
        public string Password { get; set; }
        public int IsActive { get; set; }
        public int IsDeleted { get; set; }
        public string CreatedAt { get; set; }
        public string DeletedAt { get; set; }
        public int IsAdmin { get; set; }

    }
}
