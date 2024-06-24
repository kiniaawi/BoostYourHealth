namespace byh_api.Models
{
    public class UserDiseasesAdvice
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserGender { get; set; }
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public int DietId { get; set; }
        public int SupplementationId { get; set; }
        public int WorkoutId { get; set; }
        public int IsDeleted { get; set; }
    }
}
