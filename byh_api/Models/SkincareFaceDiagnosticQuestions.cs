namespace byh_api.Models
{
    public class SkincareFaceDiagnosticQuestions
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserGender { get; set; }
        public int UserAge { get; set; }
        public string PregnantOrFeeding { get; set; }
        public string SkinType { get; set; }
        public int MainIssueId { get; set; }
        public string MainIssue { get; set; }
        public int SecondIssueId { get; set; }
        public string SecondIssue { get; set; }
        public int MainSolutionId { get; set; }
        public string MainSolution { get; set; }
        public int SecondSolutionId { get; set; }
        public string SecondSolution { get; set; }
        public int IsDeleted { get; set; }
    }
}
