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
    public class UserDiseasesAdviceController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserDiseasesAdviceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.UserDiseasesAdvice";

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

        [HttpGet("GetUserAdvice/{Id}")]
        public JsonResult GetUserAdvice(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * FROM dbo.UserDiseasesAdvice WHERE UserId = @Id AND IsDeleted = 0";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myConn.Open();
                        SqlDataReader myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                    }
                }

                response.StatusCode = 200;
                response.StatusMessage = "Data Fetched Successfully";
                HttpContext.Response.StatusCode = response.StatusCode;
                response.Data = table;
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

        [HttpGet("GetDiet/{Id}")]
        public JsonResult GetDiet(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * FROM dbo.Diets WHERE Id = @Id AND IsDeleted = 0";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myConn.Open();
                        SqlDataReader myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                    }
                }

                response.StatusCode = 200;
                response.StatusMessage = "Data Fetched Successfully";
                HttpContext.Response.StatusCode = response.StatusCode;
                response.Data = table;
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

        [HttpGet("GetSupplementation/{Id}")]
        public JsonResult GetSupplementation(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * FROM dbo.DiseasesSupplementation WHERE Id = @Id AND IsDeleted = 0";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myConn.Open();
                        SqlDataReader myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                    }
                }

                response.StatusCode = 200;
                response.StatusMessage = "Data Fetched Successfully";
                HttpContext.Response.StatusCode = response.StatusCode;
                response.Data = table;
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

        [HttpGet("GetWorkout/{Id}")]
        public JsonResult GetWorkout(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * FROM dbo.Workouts WHERE Id = @Id AND IsDeleted = 0";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myConn.Open();
                        SqlDataReader myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                    }
                }

                response.StatusCode = 200;
                response.StatusMessage = "Data Fetched Successfully";
                HttpContext.Response.StatusCode = response.StatusCode;
                response.Data = table;
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
        public JsonResult Post(UserDiseasesAdvice advice)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.UserDiseasesAdvice (UserId, UserGender, DiseaseId, DiseaseName, 
                                 DietId, SupplementationId, WorkoutId, DiagnDate, IsDeleted)
                                 VALUES (@UserId, @UserGender, @DiseaseId, (SELECT DiseaseName FROM dbo.Diseases WHERE Id = @DiseaseId),
                                 (SELECT Id FROM Diets WHERE DiseaseId = @DiseaseId), 
                                 (SELECT Id FROM DiseasesSupplementation WHERE DiseaseId = @DiseaseId),
                                 (SELECT Id FROM Workouts WHERE DiseaseId = @DiseaseId),
                                 GETDATE(), 0);";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", advice.UserId);
                        myCommand.Parameters.AddWithValue("@UserGender", advice.UserGender);
                        myCommand.Parameters.AddWithValue("@DiseaseId", advice.DiseaseId);
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

        [HttpPut("Delete/{Id}")]
        public JsonResult Delete(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.UserDiseasesAdvice SET IsDeleted = 1
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
                    response.StatusMessage = "DiseasesSymptom Deleted Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Failed to Delete DiseasesSymptom";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }      
    }
}
