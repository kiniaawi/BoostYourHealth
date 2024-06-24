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
    public class BodySkincareAdviceController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public BodySkincareAdviceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetAdvice/{Id}")]
        public JsonResult GetAdvice(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.BodySkincareAdvice WHERE UserId = @Id AND IsDeleted = 0";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", Id);
                        myConn.Open();
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
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

        [HttpPut("Delete/{Id}")]
        public JsonResult Delete(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.BodySkincareAdvice SET IsDeleted = 1
                            WHERE Id = @Id AND IsDeleted = 0;";

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
                    response.StatusMessage = "SkinType Deleted Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Failed to Delete SkinType";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }

        [HttpPost]
        public JsonResult Post(BodySkincareAdvice question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.BodySkincareAdvice (UserId, UserGender, UserAge, PregnantOrFeeding, 
                                 SkinType, MainIssueId, MainIssue, MainSolution, SkincareRoutineId, Step1, Step2, 
                                 Step3, Step4, Step5, DiagnDate, IsDeleted)
                                 VALUES (@UserId, @UserGender, @UserAge, @PregnantOrFeeding, @SkinType, @MainIssueId, 
                                 (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id = @MainIssueId), 
                                 (
                                    SELECT STRING_AGG(Solution, ', ') AS CombinedSolutions
                                    FROM dbo.DealingBodySkinIssues
                                    WHERE SkinIssue = (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id = @MainIssueId)
                                 ),
                                 (SELECT Id FROM dbo.BodycareSteps WHERE SkinType = @SkinType),
                                 (
                                     CASE
                                         WHEN (SELECT Step1 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Przemyć wodą' 
                                                THEN 'Mycie: Przemyć wodą - Codziennie'
                                         WHEN (SELECT Step1 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Mycie' THEN
                                             (SELECT TOP 1 CONCAT('Mycie: ', ProductName, ' - ', Frequency) FROM dbo.ShowerGels WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Żel Pod Prysznic'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step2 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Olejek' THEN
                                             (SELECT TOP 1 CONCAT('Olejek: ', ProductName, ' - ', Frequency) FROM dbo.BodyOils WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Olejek'))
                                         WHEN (SELECT Step2 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Złuszczanie' THEN
                                             (SELECT TOP 1 CONCAT('Złuszczanie: ', ProductName, ' - ', Frequency) FROM dbo.BodyExfoliants WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Peeling'))
                                        WHEN (SELECT Step2 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Składnik Aktywny' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.BodyActives 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingBodySkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('S-Aktywny: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.BodyActives 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingBodySkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                            )
                                                        )
                                                    ELSE ''
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step3 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Balsam' THEN
                                             (SELECT TOP 1 CONCAT('Balsam: ', ProductName, ' - ', Frequency) FROM dbo.BodyMoisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Balsam do Ciała'))
                                         WHEN (SELECT Step3 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Olejek' THEN
                                             (SELECT TOP 1 CONCAT('Olejek: ', ProductName, ' - ', Frequency) FROM dbo.BodyOils WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Olejek'))
                                        WHEN (SELECT Step3 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Składnik Aktywny' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.BodyActives 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingBodySkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('S-Aktywny: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.BodyActives 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingBodySkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                            )
                                                        )
                                                    ELSE ''
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step4 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Balsam' THEN
                                             (SELECT TOP 1 CONCAT('Balsam: ', ProductName, ' - ', Frequency) FROM dbo.BodyMoisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Balsam do Ciała'))
                                        WHEN (SELECT Step4 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Składnik Aktywny' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.BodyActives 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingBodySkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('S-Aktywny: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.BodyActives 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingBodySkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                            )
                                                        )
                                                    ELSE ''
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step5 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Balsam' THEN
                                             (SELECT TOP 1 CONCAT('Balsam: ', ProductName, ' - ', Frequency) FROM dbo.BodyMoisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Balsam do Ciała'))
                                        WHEN (SELECT Step5 FROM dbo.BodycareSteps WHERE SkinType = @SkinType) = 'Składnik Aktywny' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.BodyActives 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingBodySkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('S-Aktywny: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.BodyActives 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingBodySkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId))
                                                            )
                                                        )
                                                    ELSE ''
                                                END
                                            )
                                         ELSE '' 
                                     END
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
