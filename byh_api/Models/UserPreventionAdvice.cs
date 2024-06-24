﻿namespace byh_api.Models
{
    public class UserPreventionAdvice
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserGender { get; set; }
        public int DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public int PreventionId { get; set; }
        public int IsDeleted { get; set; }
    }
}