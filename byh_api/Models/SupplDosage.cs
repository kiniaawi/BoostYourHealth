namespace byh_api.Models
{
    public class SupplDosage
    {
        public int Id { get; set; }
        public int SupplementId { get; set; }
        public string Supplement { get; set; }
        public string FkgTeen { get; set; }
        public string MkgTeen { get; set; }
        public string FkgAdult { get; set; }
        public string MkgAdult { get; set; }
        public int IsDeleted { get; set; }
    }
}
