using byh_api.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using System;

namespace byh_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HaircareStepsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public HaircareStepsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.HaircareSteps";

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
        public JsonResult Post(HaircareSteps step)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.HaircareSteps VALUES(@HairTypeId,
                                (SELECT HairType FROM dbo.HairTypesTable WHERE Id = @HairTypeId), 
                                @Step1, @Step2, @Step3, 
                                @Step4, @Step5, @Step6, @Step7, @Step8, @Step9, @Step10, 0)";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@HairTypeId", step.HairTypeId);
                        myCommand.Parameters.AddWithValue("@Step1", step.Step1);
                        myCommand.Parameters.AddWithValue("@Step2", step.Step2);
                        myCommand.Parameters.AddWithValue("@Step3", step.Step3);
                        myCommand.Parameters.AddWithValue("@Step4", step.Step4);
                        myCommand.Parameters.AddWithValue("@Step5", step.Step5);
                        myCommand.Parameters.AddWithValue("@Step6", step.Step6);
                        myCommand.Parameters.AddWithValue("@Step7", step.Step7);
                        myCommand.Parameters.AddWithValue("@Step8", step.Step8);
                        myCommand.Parameters.AddWithValue("@Step9", step.Step9);
                        myCommand.Parameters.AddWithValue("@Step10", step.Step10);
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
        public JsonResult Put(HaircareSteps step, int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.HaircareSteps SET HairTypeId = @HairTypeId, 
                                HairType = (SELECT HairType FROM dbo.HairTypesTable WHERE Id = @HairTypeId),
                                Step1 = @Step1,  Step2 = @Step2, Step3 = @Step3, Step4 = @Step4, Step5 = @Step5, 
                                Step6 = @Step6, Step7 = @Step7, Step8 = @Step8, Step9 = @Step9, Step10 = @Step10
                                WHERE Id = @Id";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", step.Id);
                        myCommand.Parameters.AddWithValue("@HairTypeId", step.HairTypeId);
                        myCommand.Parameters.AddWithValue("@Step1", step.Step1);
                        myCommand.Parameters.AddWithValue("@Step2", step.Step2);
                        myCommand.Parameters.AddWithValue("@Step3", step.Step3);
                        myCommand.Parameters.AddWithValue("@Step4", step.Step4);
                        myCommand.Parameters.AddWithValue("@Step5", step.Step5);
                        myCommand.Parameters.AddWithValue("@Step6", step.Step6);
                        myCommand.Parameters.AddWithValue("@Step7", step.Step7);
                        myCommand.Parameters.AddWithValue("@Step8", step.Step8);
                        myCommand.Parameters.AddWithValue("@Step9", step.Step9);
                        myCommand.Parameters.AddWithValue("@Step10", step.Step10);
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
                string query = @"UPDATE dbo.HaircareSteps SET IsDeleted = 1
                            WHERE Id = @Id AND IsDeleted = 0";

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
                string query = @"UPDATE dbo.HaircareSteps SET IsDeleted = 0
                            WHERE Id = @Id AND IsDeleted = 1";

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
