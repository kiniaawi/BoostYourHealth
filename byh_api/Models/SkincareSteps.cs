using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace byh_api.Models
{
    public class SkincareSteps
    {
        public int Id { get; set; }
        public string SkinType { get; set; }
        public string DayTime { get; set; }
        public string Step1 { get; set; }
        public string Step2 { get; set; }
        public string Step3 { get; set; }
        public string Step4 { get; set; }
        public string Step5 { get; set; }
        public string Step6 { get; set; }
        public string Step7 { get; set; }
        public string Step8 { get; set; }
        public string Step9 { get; set; }
        public string Step10 { get; set; }
        public int isDeleted { get; set; }
    }
}
