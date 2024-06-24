using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace byh_api.Models
{
    public class Response
    {
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public Registration Registration { get; set; }
        public LoginData LoginData { get; set; }
        public List<Registration> listRegistration { get; set; }

        public DataTable Data { get; internal set; }

        /*public List<SkinIssues> listSkinIssues { get; set; }
        public List<Registration> listUsers { get; set; }*/
    }
}
