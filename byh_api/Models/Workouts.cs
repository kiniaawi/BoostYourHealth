namespace byh_api.Models
{
    public class Workouts
    {
        public int Id { get; set; }
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public string WorkoutName { get; set; }
        public string Dos { get; set; }
        public string Donts { get; set; }
        public string Description { get; set; }
        public int IsDeleted { get; set; }
    }
}
