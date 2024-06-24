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
    public class HaircareAdviceController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public HaircareAdviceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("GetAdvice/{Id}")]
        public JsonResult GetAdvice(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.HaircareAdvice WHERE UserId = @Id AND IsDeleted = 0";

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
                string query = @"UPDATE dbo.HaircareAdvice SET IsDeleted = 1
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

        [HttpPost("HaircarePost")]
        public JsonResult HaircarePost(HaircareAdvice question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.HaircareAdvice (
                                    UserId, UserGender, UserAge, PregnantOrFeeding, HairType, MainIssueId, 
                                    MainIssue, MainSolution, HaircareRoutineId, Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10, 
                                    DiagnDate, IsDeleted
                                )
                                VALUES (
                                    @UserId, @UserGender, @UserAge, @PregnantOrFeeding, @HairType, @MainIssueId, 
                                    (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId), 
                                    (
                                        SELECT STRING_AGG(CONCAT(Solution, ' - ', Description), ', ') 
                                        FROM dbo.DealingHairProblems
                                        WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                    ),
                                    (SELECT Id FROM dbo.HaircareSteps WHERE HairType = @HairType),
                                    (
                                        CASE
                                            WHEN (SELECT Step1 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Przemyć wodą' THEN 'Mycie: Przemyć wodą - Codziennie'
                                            WHEN (SELECT Step1 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Złuszczanie' THEN
                                                (SELECT TOP 1 CONCAT('Złuszczanie: ', ProductName, ' - ', Frequency) FROM dbo.HairPeelings WHERE HairType = @HairType AND ProductType = 'Peeling')
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step2 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Olejowanie' THEN
                                                (SELECT TOP 1 CONCAT('Olejowanie: ', ProductName, ' - ', Frequency) FROM dbo.HairOils WHERE HairType = @HairType AND ProductType = 'Olejowanie')
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step3 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Maska' THEN
                                                (SELECT TOP 1 CONCAT('Maska: ', ProductName, ' - ', Frequency) FROM dbo.HairMasks WHERE HairType = @HairType AND ProductType = 'Maska')   
                                            WHEN (SELECT Step3 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Odżywka' THEN
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.HairConditioners 
                                                        WHERE HairType = @HairType AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingHairProblems
                                                            WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                        )
                                                    ) THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Odżywka: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.HairConditioners 
                                                            WHERE HairType = @HairType AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingHairProblems
                                                                WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                            )
                                                        )
                                                    ELSE
                                                        (SELECT TOP 1 CONCAT('Odżywka: ', ProductName, ' - ', Frequency) FROM dbo.HairConditioners WHERE HairType = @HairType AND ProductType IN ('Proteiny', 'Humektanty', 'Emolienty'))
                                                END
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step4 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Mycie' THEN
                                                (SELECT TOP 1 CONCAT('Mycie: ', ProductName, ' - ', Frequency) FROM dbo.Shampoos WHERE HairType = @HairType AND ProductType = 'Szampon')
                                            WHEN (SELECT Step4 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Odżywka' THEN
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.HairConditioners 
                                                        WHERE HairType = @HairType AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingHairProblems
                                                            WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                        )
                                                    ) THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Odżywka: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.HairConditioners 
                                                            WHERE HairType = @HairType AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingHairProblems
                                                                WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                            )
                                                        )
                                                    ELSE
                                                        (SELECT TOP 1 CONCAT('Odżywka: ', ProductName, ' - ', Frequency) FROM dbo.HairConditioners WHERE HairType = @HairType AND ProductType IN ('Proteiny', 'Humektanty', 'Emolienty'))
                                                END
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step5 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Maska' THEN
                                                (SELECT TOP 1 CONCAT('Maska: ', ProductName, ' - ', Frequency) FROM dbo.HairMasks WHERE HairType = @HairType AND ProductType = 'Maska')   
                                            WHEN (SELECT Step5 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Odżywka' THEN
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.HairConditioners 
                                                        WHERE HairType = @HairType AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingHairProblems
                                                            WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                        )
                                                    ) THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Odżywka: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.HairConditioners 
                                                            WHERE HairType = @HairType AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingHairProblems
                                                                WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                            )
                                                        )
                                                    ELSE
                                                        (SELECT TOP 1 CONCAT('Odżywka: ', ProductName, ' - ', Frequency) FROM dbo.HairConditioners WHERE HairType = @HairType AND ProductType IN ('Proteiny', 'Humektanty', 'Emolienty'))
                                                END
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step6 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Maska' THEN
                                                (SELECT TOP 1 CONCAT('Maska: ', ProductName, ' - ', Frequency) FROM dbo.HairMasks WHERE HairType = @HairType AND ProductType = 'Maska') 
                                            WHEN (SELECT Step6 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Krem' THEN
                                                (SELECT TOP 1 CONCAT('Krem: ', ProductName, ' - ', Frequency) FROM dbo.HairCreams WHERE HairType = @HairType AND ProductType = 'Krem')
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step7 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Termoochrona' THEN
                                                (SELECT TOP 1 CONCAT('Termoochrona: ', ProductName, ' - ', Frequency) FROM dbo.HeatProtection WHERE HairType = @HairType AND ProductType = 'Termoochrona') 
                                            WHEN (SELECT Step7 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Krem' THEN
                                                (SELECT TOP 1 CONCAT('Krem: ', ProductName, ' - ', Frequency) FROM dbo.HairCreams WHERE HairType = @HairType AND ProductType = 'Krem')
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step8 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Termoochrona' THEN
                                                (SELECT TOP 1 CONCAT('Termoochrona: ', ProductName, ' - ', Frequency) FROM dbo.HeatProtection WHERE HairType = @HairType AND ProductType = 'Termoochrona') 
                                            WHEN (SELECT Step8 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Olejek ochronny' THEN
                                                (SELECT TOP 1 CONCAT('Olejek ochronny: ', ProductName, ' - ', Frequency) FROM dbo.HairOilsProtection WHERE HairType = @HairType AND ProductType = 'Olejek ochronny')
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE
                                            WHEN (SELECT Step9 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Olejek ochronny' THEN
                                                (SELECT TOP 1 CONCAT('Olejek ochronny: ', ProductName, ' - ', Frequency) FROM dbo.HairOilsProtection WHERE HairType = @HairType AND ProductType = 'Olejek ochronny')  
                                            WHEN (SELECT Step9 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Serum' THEN
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.HairSerums 
                                                        WHERE HairType = @HairType AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingHairProblems
                                                            WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                        )
                                                    ) THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.HairSerums 
                                                            WHERE HairType = @HairType AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingHairProblems
                                                                WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                            )
                                                        )
                                                    ELSE ''
                                                END
                                            ELSE '' 
                                        END
                                    ),
                                    (
                                        CASE 
                                            WHEN (SELECT Step10 FROM dbo.HaircareSteps WHERE HairType = @HairType) = 'Serum' THEN
                                                CASE
                                                    WHEN EXISTS (
                                                        SELECT 1
                                                        FROM dbo.HairSerums 
                                                        WHERE HairType = @HairType AND ProductType IN (
                                                            SELECT Solution
                                                            FROM dbo.DealingHairProblems
                                                            WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                        )
                                                    ) THEN
                                                        (
                                                            SELECT STRING_AGG(CONCAT('Serum: ', ProductName, ' - ', Frequency), '; ')
                                                            FROM dbo.HairSerums 
                                                            WHERE HairType = @HairType AND ProductType IN (
                                                                SELECT Solution
                                                                FROM dbo.DealingHairProblems
                                                                WHERE HairProblem IN (SELECT HairProblem FROM dbo.HairProblems WHERE Id = @MainIssueId) AND IsDeleted = 0
                                                            )
                                                        )
                                                    ELSE ''
                                                END
                                            ELSE '' 
                                        END
                                    ),
                                    GETDATE(), 
                                    0
                                );
                                ";


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
                        myCommand.Parameters.AddWithValue("@HairType", question.HairType);
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
