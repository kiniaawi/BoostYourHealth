namespace byh_api.Models
{
    public class SupplDiagnosticQuestions
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string IssueCategory { get; set; }
        public string UserGender { get; set; }
        public int UserAge { get; set; }
        public string PregnantOrFeeding { get; set; }
        public string IssuesId { get; set; }
        public string SolutionsId { get; set; }
        public string IsDeleted { get; set; }
    }
}
