namespace byh_api.Models
{
    public class Diets
    {
        public int Id { get; set; }
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public string DietName { get; set; }
        public string Dos { get; set; }
        public string Donts { get; set; }
        public string Description { get; set; }
        public int IsDeleted { get; set; }
    }
}
