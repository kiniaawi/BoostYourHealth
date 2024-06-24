namespace byh_api.Models
{
    public class Exfoliants
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public int ProductTypeId { get; set; }
        public string ProductType { get; set; }
        public string SkinType { get; set; }
        public string DayTime { get; set; }
        public string Frequency { get; set; }
        public int MinAge { get; set; }
        public string ImageURL { get; set; }
        public string ForPregnant { get; set; }
        public int IsDeleted { get; set; }
    }
}
