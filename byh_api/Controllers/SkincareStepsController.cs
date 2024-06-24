using byh_api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace byh_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkincareStepsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SkincareStepsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.SkincareSteps";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myConn.Close();
                    }

                    response.StatusCode = 200;
                    response.StatusMessage = "Data Fetched Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Fetching Data Failed";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }

        [HttpPost]
        public JsonResult Post(SkincareSteps skincareSteps)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.SkincareSteps VALUES(@SkinType, @DayTime, @Step1, @Step2, @Step3, 
                                @Step4, @Step5, @Step6, @Step7, @Step8, @Step9, @Step10, 0)";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@SkinType", skincareSteps.SkinType);
                        myCommand.Parameters.AddWithValue("@DayTime", skincareSteps.DayTime);
                        myCommand.Parameters.AddWithValue("@Step1", skincareSteps.Step1);
                        myCommand.Parameters.AddWithValue("@Step2", skincareSteps.Step2);
                        myCommand.Parameters.AddWithValue("@Step3", skincareSteps.Step3);
                        myCommand.Parameters.AddWithValue("@Step4", skincareSteps.Step4);
                        myCommand.Parameters.AddWithValue("@Step5", skincareSteps.Step5);
                        myCommand.Parameters.AddWithValue("@Step6", skincareSteps.Step6);
                        myCommand.Parameters.AddWithValue("@Step7", skincareSteps.Step7);
                        myCommand.Parameters.AddWithValue("@Step8", skincareSteps.Step8);
                        myCommand.Parameters.AddWithValue("@Step9", skincareSteps.Step9);
                        myCommand.Parameters.AddWithValue("@Step10", skincareSteps.Step10);
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myConn.Close();
                    }

                    response.StatusCode = 200;
                    response.StatusMessage = "Data Inserted Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Inserting Data Failed";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }

        [HttpPut("UpdateStep/{Id}")]
        public JsonResult Put(SkincareSteps skincareSteps, int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.SkincareSteps SET SkinType = @SkinType, DayTime = @DayTime, Step1 = @Step1,  Step2 = @Step2, 
                                Step3 = @Step3, Step4 = @Step4, Step5 = @Step5, Step6 = @Step6, Step7 = @Step7, Step8 = @Step8, 
                                Step9 = @Step9, Step10 = @Step10
                                WHERE Id = @Id";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", skincareSteps.Id);
                        myCommand.Parameters.AddWithValue("@SkinType", skincareSteps.SkinType);
                        myCommand.Parameters.AddWithValue("@DayTime", skincareSteps.DayTime);
                        myCommand.Parameters.AddWithValue("@Step1", skincareSteps.Step1);
                        myCommand.Parameters.AddWithValue("@Step2", skincareSteps.Step2);
                        myCommand.Parameters.AddWithValue("@Step3", skincareSteps.Step3);
                        myCommand.Parameters.AddWithValue("@Step4", skincareSteps.Step4);
                        myCommand.Parameters.AddWithValue("@Step5", skincareSteps.Step5);
                        myCommand.Parameters.AddWithValue("@Step6", skincareSteps.Step6);
                        myCommand.Parameters.AddWithValue("@Step7", skincareSteps.Step7);
                        myCommand.Parameters.AddWithValue("@Step8", skincareSteps.Step8);
                        myCommand.Parameters.AddWithValue("@Step9", skincareSteps.Step9);
                        myCommand.Parameters.AddWithValue("@Step10", skincareSteps.Step10);
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myConn.Close();
                    }

                    response.StatusCode = 200;
                    response.StatusMessage = "Data Updated Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Updating Data Failed";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }

        [HttpPut("DelStep/{Id}")]
        public JsonResult DelStep(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.SkincareSteps SET isDeleted = 1
                            WHERE Id = @Id AND isDeleted = 0";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myConn.Close();
                    }

                    response.StatusCode = 200;
                    response.StatusMessage = "Step Deleted Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Failed to Delete Step";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }

        [HttpPut("RevStep/{Id}")]
        public JsonResult RevStep(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.SkincareSteps SET isDeleted = 0
                            WHERE Id = @Id AND isDeleted = 1";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myConn.Close();
                    }

                    response.StatusCode = 200;
                    response.StatusMessage = "Step Reverted Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Failed to Revert Step";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }
    }
}
