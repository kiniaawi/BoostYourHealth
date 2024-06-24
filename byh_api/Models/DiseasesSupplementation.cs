namespace byh_api.Models
{
    public class DiseasesSupplementation
    {
        public int Id { get; set; }
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public string Supplement { get; set; }
        public string Description { get; set; }
        public int IsDeleted { get; set; }
    }
}
