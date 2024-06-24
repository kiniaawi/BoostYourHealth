using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace byh_api.Models
{
    public class SkinIssues
    {
        public int Id { get; set; }
        public string SkinIssue { get; set; }
        public string Placement { get; set; }
        public string ImageURL { get; set; }
        public int IsDeleted { get; set; }

    }
}
