namespace byh_api.Models
{
    public class Diseases
    {
        public int Id { get; set; }
        public string DiseaseName { get; set; }
        public string Diet { get; set; }
        public string Supplementation { get; set; }
        public string Workout { get; set; }
        public string Preventable { get; set; }
        public int IsDeleted { get; set; }
    }
}
