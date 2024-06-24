using System.ComponentModel.DataAnnotations;

namespace byh_api.Models
{
    public class LoginData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int IsActive { get; set; }
        public int IsDeleted { get; set; }
        public string CreatedAt { get; set; }
        public string DeletedAt { get; set; }
        public int IsAdmin { get; set; }
    }
}
