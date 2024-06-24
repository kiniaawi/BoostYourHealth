namespace byh_api.Models
{
    public class DiseasesSymptoms
    {
        public int Id { get; set; }
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public string MainSymptom { get; set; }
        public string SideSymptoms { get; set; }
        public int IsDeleted { get; set; }
    }
}
