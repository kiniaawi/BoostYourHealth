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
    public class FaceSkincareAdviceController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public FaceSkincareAdviceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetMorningFaceSkincareAdvice/{Id}")]
        public JsonResult GetMorningFaceSkincareAdvice(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.MorningSkincareAdvice WHERE UserId = @Id AND IsDeleted = 0";

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

        [HttpGet("GetEveningFaceSkincareAdvice/{Id}")]
        public JsonResult GetEveningFaceSkincareAdvice(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.EveningSkincareAdvice WHERE UserId = @Id AND IsDeleted = 0";

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
                string query = @"UPDATE dbo.MorningSkincareAdvice SET IsDeleted = 1
                            WHERE Id = @Id AND IsDeleted = 0;

                            UPDATE dbo.EveningSkincareAdvice SET IsDeleted = 1
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


        [HttpPost("PostMorningFaceSkincareAdvice")]
        public JsonResult PostMorningFaceSkincareAdvice(FaceSkincareAdvice question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.MorningSkincareAdvice (UserId, UserGender, UserAge, PregnantOrFeeding, 
                                 SkinType, MainIssueId, MainIssue, SecondIssueId, SecondIssue, MainSolution, SecondSolution,
                                 SkincareRoutineId, Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10,
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
                                 (SELECT Id FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano'),
                                 (
                                     CASE
                                         WHEN (SELECT Step1 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Przemyć twarz wodą' 
                                                THEN 'Mycie: Przemyć twarz wodą - Codziennie'
                                         WHEN (SELECT Step1 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Żel do mycia twarzy' THEN
                                             (SELECT TOP 1 CONCAT('Żel do mycia twarzy: ', ProductName, ' - ', Frequency) FROM dbo.FoamCleansers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Żel do mycia twarzy', 'Nawilżająca Emulsja do Mycia', 'Żel oczyszczający i natłuszczający'))
                                         WHEN (SELECT Step1 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Pianka do mycia twarzy' THEN
                                             (SELECT TOP 1 CONCAT('Pianka do mycia twarzy: ', ProductName, ' - ', Frequency) FROM dbo.FoamCleansers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Żel do mycia twarzy', 'Pianka do mycia twarzy'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step2 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Tonik' THEN
                                             (SELECT TOP 1 CONCAT('Tonik: ', ProductName, ' - ', Frequency) FROM dbo.Toners WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Tonik'))
                                         WHEN (SELECT Step2 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Krem nawilżający' THEN
                                             (SELECT TOP 1 CONCAT('Krem nawilżający: ', ProductName, ' - ', Frequency) FROM dbo.Moisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem nawilżający'))
                                        WHEN (SELECT Step2 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Serum' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.Serums 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingSkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                            AND DayTime = 'Rano'
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingSkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                                AND DayTime = 'Rano'
                                                            )
                                                        )
                                                    ELSE
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType AND DayTime = 'Rano'
                                                        )
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step3 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Esencja' THEN
                                             (SELECT TOP 1 CONCAT('Esencja: ', ProductName, ' - ', Frequency) FROM dbo.Essences WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Esencja'))
                                         WHEN (SELECT Step3 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'SPF' THEN
                                             (SELECT TOP 1 CONCAT('SPF: ', ProductName, ' - ', Frequency) FROM dbo.SPF WHERE SkinType = @SkinType 
                                             AND ProductType IN ('SPF'))
                                         WHEN (SELECT Step3 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Krem pod oczy' THEN
                                             (SELECT TOP 1 CONCAT('Krem pod oczy: ', ProductName, ' - ', Frequency) FROM dbo.EyeCreams WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem pod oczy'))
                                        WHEN (SELECT Step3 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Serum' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.Serums 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingSkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                            AND DayTime = 'Rano'
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingSkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                                AND DayTime = 'Rano'
                                                            )
                                                        )
                                                    ELSE
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType AND DayTime = 'Rano'
                                                        )
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step4 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Krem nawilżający' THEN
                                             (SELECT TOP 1 CONCAT('Krem nawilżający: ', ProductName, ' - ', Frequency) FROM dbo.Moisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem nawilżający'))
                                         WHEN (SELECT Step4 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'SPF' THEN
                                             (SELECT TOP 1 CONCAT('SPF: ', ProductName, ' - ', Frequency) FROM dbo.SPF WHERE SkinType = @SkinType 
                                             AND ProductType IN ('SPF'))
                                         WHEN (SELECT Step4 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Krem pod oczy' THEN
                                             (SELECT TOP 1 CONCAT('Krem pod oczy: ', ProductName, ' - ', Frequency) FROM dbo.EyeCreams WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem pod oczy'))
                                        WHEN (SELECT Step4 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Serum' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.Serums 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingSkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                            AND DayTime = 'Rano'
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingSkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                                AND DayTime = 'Rano'
                                                            )
                                                        )
                                                    ELSE
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType AND DayTime = 'Rano'
                                                        )
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step5 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Krem nawilżający' THEN
                                             (SELECT TOP 1 CONCAT('Krem nawilżający: ', ProductName, ' - ', Frequency) FROM dbo.Moisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem nawilżający'))
                                         WHEN (SELECT Step5 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'SPF' THEN
                                             (SELECT TOP 1 CONCAT('SPF: ', ProductName, ' - ', Frequency) FROM dbo.SPF WHERE SkinType = @SkinType 
                                             AND ProductType IN ('SPF'))
                                         WHEN (SELECT Step5 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Krem pod oczy' THEN
                                             (SELECT TOP 1 CONCAT('Krem pod oczy: ', ProductName, ' - ', Frequency) FROM dbo.EyeCreams WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem pod oczy'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step6 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'Krem nawilżający' THEN
                                             (SELECT TOP 1 CONCAT('Krem nawilżający: ', ProductName, ' - ', Frequency) FROM dbo.Moisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem nawilżający'))
                                         WHEN (SELECT Step6 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'SPF' THEN
                                             (SELECT TOP 1 CONCAT('SPF: ', ProductName, ' - ', Frequency) FROM dbo.SPF WHERE SkinType = @SkinType 
                                             AND ProductType IN ('SPF'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step7 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Rano') = 'SPF' THEN
                                             (SELECT TOP 1 CONCAT('SPF: ', ProductName, ' - ', Frequency) FROM dbo.SPF WHERE SkinType = @SkinType 
                                             AND ProductType IN ('SPF'))
                                         ELSE '' 
                                     END
                                 ), '', '', '',
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

        [HttpPost("PostEveningFaceSkincareAdvice")]
        public JsonResult PostEveningFaceSkincareAdvice(FaceSkincareAdvice question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.EveningSkincareAdvice (UserId, UserGender, UserAge, PregnantOrFeeding, 
                                 SkinType, MainIssueId, MainIssue, SecondIssueId, SecondIssue, MainSolution, SecondSolution,
                                 SkincareRoutineId, Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10,
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
                                 (SELECT Id FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór'),
                                 (
                                     CASE
                                         WHEN (SELECT Step1 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Olejek do demakijażu' THEN
                                             (SELECT TOP 1 CONCAT('Olejek do demakijażu: ', ProductName, ' - ', Frequency) FROM dbo.OilCleaners WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Olejek do demakijażu'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step2 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Żel do mycia twarzy' THEN
                                             (SELECT TOP 1 CONCAT('Żel do mycia twarzy: ', ProductName, ' - ', Frequency) FROM dbo.FoamCleansers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Żel do mycia twarzy', 'Nawilżająca Emulsja do Mycia', 'Żel oczyszczający i natłuszczający'))
                                         WHEN (SELECT Step2 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Pianka do mycia twarzy' THEN
                                             (SELECT TOP 1 CONCAT('Pianka do mycia twarzy: ', ProductName, ' - ', Frequency) FROM dbo.FoamCleansers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Żel do mycia twarzy', 'Pianka do mycia twarzy'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step3 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Tonik' THEN
                                             (SELECT TOP 1 CONCAT('Tonik: ', ProductName, ' - ', Frequency) FROM dbo.Toners WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Tonik'))
                                         WHEN (SELECT Step3 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Peeling' THEN
                                             (SELECT TOP 1 CONCAT('Peeling: ', ProductName, ' - ', Frequency) FROM dbo.Exfoliants WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Peeling'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step4 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Maseczka' THEN
                                             (SELECT TOP 1 CONCAT('Maseczka: ', ProductName, ' - ', Frequency) FROM dbo.Masks WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Maska'))
                                         WHEN (SELECT Step4 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Krem pod oczy' THEN
                                             (SELECT TOP 1 CONCAT('Krem pod oczy: ', ProductName, ' - ', Frequency) FROM dbo.EyeCreams WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem pod oczy'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step5 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Krem nawilżający' THEN
                                             (SELECT TOP 1 CONCAT('Krem nawilżający: ', ProductName, ' - ', Frequency) FROM dbo.Moisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem nawilżający'))
                                         WHEN (SELECT Step5 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Tonik' THEN
                                             (SELECT TOP 1 CONCAT('Tonik: ', ProductName, ' - ', Frequency) FROM dbo.Toners WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Tonik'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step6 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Esencja' THEN
                                             (SELECT TOP 1 CONCAT('Esencja: ', ProductName, ' - ', Frequency) FROM dbo.Essences WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Esencja'))
                                        WHEN (SELECT Step6 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Serum' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.Serums 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingSkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                            AND DayTime = 'Wieczór'
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingSkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                                AND DayTime = 'Wieczór'
                                                            )
                                                        )
                                                    ELSE
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType AND DayTime = 'Wieczór'
                                                        )
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step7 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Krem pod oczy' THEN
                                             (SELECT TOP 1 CONCAT('Krem pod oczy: ', ProductName, ' - ', Frequency) FROM dbo.EyeCreams WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem pod oczy'))
                                        WHEN (SELECT Step7 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Serum' THEN
                                            (
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.Serums 
                                                        WHERE SkinType = @SkinType 
                                                        AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingSkinIssues
                                                            WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                            AND DayTime = 'Wieczór'
                                                        )
                                                    )
                                                    THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType 
                                                            AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingSkinIssues
                                                                WHERE SkinIssue IN (SELECT SkinIssue FROM dbo.SkinIssues WHERE Id IN (@MainIssueId, @SecondIssueId))
                                                                AND DayTime = 'Wieczór'
                                                            )
                                                        )
                                                    ELSE
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency, '-', ApplicationWay), '; ')
                                                            FROM dbo.Serums 
                                                            WHERE SkinType = @SkinType AND DayTime = 'Wieczór'
                                                        )
                                                END
                                            )
                                         ELSE '' 
                                     END
                                 ), 
                                 (
                                     CASE
                                         WHEN (SELECT Step8 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Krem nawilżający' THEN
                                             (SELECT TOP 1 CONCAT('Krem nawilżający: ', ProductName, ' - ', Frequency) FROM dbo.Moisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem nawilżający'))
                                         WHEN (SELECT Step8 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Krem pod oczy' THEN
                                             (SELECT TOP 1 CONCAT('Krem pod oczy: ', ProductName, ' - ', Frequency) FROM dbo.EyeCreams WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem pod oczy'))
                                         ELSE '' 
                                     END
                                 ),
                                 (
                                     CASE
                                         WHEN (SELECT Step9 FROM dbo.SkincareSteps WHERE SkinType = @SkinType AND DayTime = 'Wieczór') = 'Krem nawilżający' THEN
                                             (SELECT TOP 1 CONCAT('Krem nawilżający: ', ProductName, ' - ', Frequency) FROM dbo.Moisturizers WHERE SkinType = @SkinType 
                                             AND ProductType IN ('Krem nawilżający'))
                                         ELSE '' 
                                     END
                                 ),'',
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
