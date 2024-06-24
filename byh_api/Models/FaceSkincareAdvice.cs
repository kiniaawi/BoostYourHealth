namespace byh_api.Models
{
    public class FaceSkincareAdvice
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
        public string MainSolution { get; set; }
        public string SecondSolution { get; set; }
        public int SkincareRoutineId { get; set; }
        public string Step1 { get; set; }
        public string Step2 { get; set; }
        public string Step3 { get; set; }
        public string Step4 { get; set; }
        public string Step5 { get; set; }
        public string Step6 { get; set; }
        public string Step7 { get; set; }
        public string Step8 { get; set; }
        public string Step9 { get; set; }
        public string Step10 { get; set; }
        public int IsDeleted { get; set; }
    }
}
