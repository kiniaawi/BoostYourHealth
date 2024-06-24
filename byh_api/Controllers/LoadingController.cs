using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace byh_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoadingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Ładowanie...");
        }
    }
}
