namespace byh_api.Models
{
    public class DiseasesPrevention
    {
        public int Id { get; set; }
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public string HowToPrevent { get; set; }
        public string Tips { get; set; }
        public string Description { get; set; }
        public int IsDeleted { get; set; }
    }
}
