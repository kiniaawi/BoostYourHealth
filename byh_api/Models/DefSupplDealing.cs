namespace byh_api.Models
{
    public class DefSupplDealing
    {
        public int Id { get; set; }
        public int IssueId { get; set; }
        public int SupplementId { get; set; }
        public int IsDeleted { get; set; }
        public string IssueCategory { get; set; }
    }
}
