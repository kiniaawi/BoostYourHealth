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
    public class SkincareFaceDiagnosticQuestionsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SkincareFaceDiagnosticQuestionsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.SkincareFaceDiagnosticQuestions";

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

        [HttpGet("GetUserSkincareFaceAdvice/{Id}")]
        public JsonResult GetUserSupplAdvice(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * FROM dbo.SkincareFaceDiagnosticQuestions WHERE UserId = @Id AND IsDeleted = 0";

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

        [HttpGet("GetDetailsSupplAdvice")]
        public JsonResult GetDetailsSupplAdvice(SupplDiagnosticQuestions question)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * FROM dbo.SupplAdvice WHERE Id = @Id AND UserId = @UserId";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", question.Id);
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
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


        [HttpPost("PostData")]
        public JsonResult PostData(SkincareFaceDiagnosticQuestions question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.SkincareFaceDiagnosticQuestions (UserId, UserGender, UserAge, PregnantOrFeeding, 
                                 SkinType, MainIssueId, MainIssue, SecondIssueId, SecondIssue, MainSolution, SecondSolution, 
                                 DiagnDate, IsDeleted)
                                 VALUES (@UserId, @UserGender, @UserAge, @PregnantOrFeeding, @SkinType, @MainIssueId, 
                                 (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id = @MainIssueId), @SecondIssueId,
                                 (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id = @SecondIssueId),
                                 (
                                    SELECT STRING_AGG(Solution, ', ') AS CombinedSolutions
                                    FROM dbo.DealingSkinIssues
                                    WHERE SkinIssue = (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id = @MainIssueId)
                                 ),
                                 (
                                    SELECT STRING_AGG(Solution, ', ') AS CombinedSolutions
                                    FROM dbo.DealingSkinIssues
                                    WHERE SkinIssue = (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id = @SecondIssueId)
                                 ), 
                                 GETDATE(), 0);";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
                        myCommand.Parameters.AddWithValue("@UserGender", question.UserGender);
                        myCommand.Parameters.AddWithValue("@UserAge", question.UserAge);
                        myCommand.Parameters.AddWithValue("@PregnantOrFeeding", question.PregnantOrFeeding);
                        myCommand.Parameters.AddWithValue("@SkinType", question.SkinType);
                        myCommand.Parameters.AddWithValue("@MainIssueId", question.MainIssueId);
                        myCommand.Parameters.AddWithValue("@SecondIssueId", question.SecondIssueId);
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
    }
}
