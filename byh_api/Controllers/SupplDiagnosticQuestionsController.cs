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
    public class SupplDiagnosticQuestionsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SupplDiagnosticQuestionsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * from dbo.SupplDiagnosticQuestions";

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

        [HttpGet("GetUserSupplAdvice/{Id}")]
        public JsonResult GetUserSupplAdvice(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"SELECT * FROM dbo.SupplAdvice WHERE UserId = @Id AND IsDeleted = 0";

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


        [HttpPost]
        public JsonResult Post(SupplDiagnosticQuestions question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.SupplDiagnosticQuestions (UserId, IssueCategory, UserGender, UserAge, 
                                 PregnantOrFeeding, IssuesId, SolutionsId, IsDeleted)
                                 VALUES (@UserId, @IssueCategory, @UserGender, @UserAge, @PregnantOrFeeding, @IssuesId,
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))), 0);

                                 INSERT INTO dbo.SupplAdvice (UserId, IssuesId, SolutionsId, Issues, Solutions, SupplDosage, IsDeleted, IssueCategory, DiagnDate)
                                 VALUES (@UserId, @IssuesId, 
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (SELECT STRING_AGG(Issue, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS VARCHAR)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (
                                    SELECT STRING_AGG(IssueSupplement, ';') FROM (
                                        SELECT CONCAT(Issue, ': ', STRING_AGG(Supplement, ', ')) AS IssueSupplement
                                        FROM dbo.DefSupplDealing
                                        WHERE IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                        GROUP BY Issue
                                    ) AS IssueSupplements
                                ),
                                (SELECT STRING_AGG(DosageSupplement, '; ') AS SupplDosage
                                FROM (
                                    SELECT 
                                        CONCAT(dd.Supplement, ': ',
                                            CASE 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge <= 19 THEN sd.MkgTeen 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge > 19 THEN sd.MkgAdult 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge <= 19 THEN sd.FkgTeen 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge > 19 THEN sd.FkgAdult 
                                                ELSE 'Brak danych' 
                                            END
                                        ) AS DosageSupplement
                                    FROM dbo.DefSupplDealing dd
                                    INNER JOIN dbo.SupplDosage sd ON dd.SupplementId = sd.SupplementId
                                    WHERE dd.IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                ) AS DosageSupplements)
                                ,0, @IssueCategory, GETDATE())";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
                        myCommand.Parameters.AddWithValue("@IssueCategory", question.IssueCategory);
                        myCommand.Parameters.AddWithValue("@UserGender", question.UserGender);
                        myCommand.Parameters.AddWithValue("@UserAge", question.UserAge);
                        myCommand.Parameters.AddWithValue("@PregnantOrFeeding", question.PregnantOrFeeding);
                        myCommand.Parameters.AddWithValue("@IssuesId", question.IssuesId);
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

        [HttpPost("PostSkinDiagnosticQuestions")]
        public JsonResult PostSkinDiagnosticQuestions(SupplSkinDiagnosticQuestions question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.SupplDiagnosticQuestions (UserId, IssueCategory, UserGender, UserAge, 
                                 PregnantOrFeeding, IssuesId, SolutionsId, IsDeleted)
                                 VALUES (@UserId, @IssueCategory, @UserGender, @UserAge, @PregnantOrFeeding, @IssuesId,
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))), 0);

                                 INSERT INTO dbo.SupplAdvice (UserId, IssuesId, SolutionsId, Issues, Solutions, SupplDosage, IsDeleted, IssueCategory, DiagnDate)
                                 VALUES (@UserId, @IssuesId, 
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (SELECT STRING_AGG(Issue, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS VARCHAR)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (
                                    SELECT STRING_AGG(IssueSupplement, ';') FROM (
                                        SELECT CONCAT(Issue, ': ', STRING_AGG(Supplement, ', ')) AS IssueSupplement
                                        FROM dbo.DefSupplDealing
                                        WHERE IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                        GROUP BY Issue
                                    ) AS IssueSupplements
                                ),
                                (SELECT STRING_AGG(DosageSupplement, '; ') AS SupplDosage
                                FROM (
                                    SELECT 
                                        CONCAT(dd.Supplement, ': ',
                                            CASE 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge <= 19 THEN sd.MkgTeen 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge > 19 THEN sd.MkgAdult 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge <= 19 THEN sd.FkgTeen 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge > 19 THEN sd.FkgAdult 
                                                ELSE 'Brak danych' 
                                            END
                                        ) AS DosageSupplement
                                    FROM dbo.DefSupplDealing dd
                                    INNER JOIN dbo.SupplDosage sd ON dd.SupplementId = sd.SupplementId
                                    WHERE dd.IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                ) AS DosageSupplements)
                                ,0, @IssueCategory, GETDATE())";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
                        myCommand.Parameters.AddWithValue("@IssueCategory", question.IssueCategory);
                        myCommand.Parameters.AddWithValue("@UserGender", question.UserGender);
                        myCommand.Parameters.AddWithValue("@UserAge", question.UserAge);
                        myCommand.Parameters.AddWithValue("@PregnantOrFeeding", question.PregnantOrFeeding);
                        myCommand.Parameters.AddWithValue("@IssuesId", question.IssuesId);
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

        [HttpPost("PostHairNailsDiagnosticQuestions")]
        public JsonResult PostHairNailsDiagnosticQuestions(SupplSkinDiagnosticQuestions question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.SupplDiagnosticQuestions (UserId, IssueCategory, UserGender, UserAge, 
                                 PregnantOrFeeding, IssuesId, SolutionsId, IsDeleted)
                                 VALUES (@UserId, @IssueCategory, @UserGender, @UserAge, @PregnantOrFeeding, @IssuesId,
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))), 0);

                                 INSERT INTO dbo.SupplAdvice (UserId, IssuesId, SolutionsId, Issues, Solutions, SupplDosage, IsDeleted, IssueCategory, DiagnDate)
                                 VALUES (@UserId, @IssuesId, 
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (SELECT STRING_AGG(Issue, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS VARCHAR)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (
                                    SELECT STRING_AGG(IssueSupplement, ';') FROM (
                                        SELECT CONCAT(Issue, ': ', STRING_AGG(Supplement, ', ')) AS IssueSupplement
                                        FROM dbo.DefSupplDealing
                                        WHERE IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                        GROUP BY Issue
                                    ) AS IssueSupplements
                                ),
                                (SELECT STRING_AGG(DosageSupplement, '; ') AS SupplDosage
                                FROM (
                                    SELECT 
                                        CONCAT(dd.Supplement, ': ',
                                            CASE 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge <= 19 THEN sd.MkgTeen 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge > 19 THEN sd.MkgAdult 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge <= 19 THEN sd.FkgTeen 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge > 19 THEN sd.FkgAdult 
                                                ELSE 'Brak danych' 
                                            END
                                        ) AS DosageSupplement
                                    FROM dbo.DefSupplDealing dd
                                    INNER JOIN dbo.SupplDosage sd ON dd.SupplementId = sd.SupplementId
                                    WHERE dd.IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                ) AS DosageSupplements)
                                ,0, @IssueCategory, GETDATE())";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
                        myCommand.Parameters.AddWithValue("@IssueCategory", question.IssueCategory);
                        myCommand.Parameters.AddWithValue("@UserGender", question.UserGender);
                        myCommand.Parameters.AddWithValue("@UserAge", question.UserAge);
                        myCommand.Parameters.AddWithValue("@PregnantOrFeeding", question.PregnantOrFeeding);
                        myCommand.Parameters.AddWithValue("@IssuesId", question.IssuesId);
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

        [HttpPost("PostDigestSysDiagnosticQuestions")]
        public JsonResult PostDigestSysDiagnosticQuestions(SupplSkinDiagnosticQuestions question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.SupplDiagnosticQuestions (UserId, IssueCategory, UserGender, UserAge, 
                                 PregnantOrFeeding, IssuesId, SolutionsId, IsDeleted)
                                 VALUES (@UserId, @IssueCategory, @UserGender, @UserAge, @PregnantOrFeeding, @IssuesId,
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))), 0);

                                 INSERT INTO dbo.SupplAdvice (UserId, IssuesId, SolutionsId, Issues, Solutions, SupplDosage, IsDeleted, IssueCategory, DiagnDate)
                                 VALUES (@UserId, @IssuesId, 
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (SELECT STRING_AGG(Issue, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS VARCHAR)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (
                                    SELECT STRING_AGG(IssueSupplement, ';') FROM (
                                        SELECT CONCAT(Issue, ': ', STRING_AGG(Supplement, ', ')) AS IssueSupplement
                                        FROM dbo.DefSupplDealing
                                        WHERE IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                        GROUP BY Issue
                                    ) AS IssueSupplements
                                ),
                                (SELECT STRING_AGG(DosageSupplement, '; ') AS SupplDosage
                                FROM (
                                    SELECT 
                                        CONCAT(dd.Supplement, ': ',
                                            CASE 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge <= 19 THEN sd.MkgTeen 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge > 19 THEN sd.MkgAdult 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge <= 19 THEN sd.FkgTeen 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge > 19 THEN sd.FkgAdult 
                                                ELSE 'Brak danych' 
                                            END
                                        ) AS DosageSupplement
                                    FROM dbo.DefSupplDealing dd
                                    INNER JOIN dbo.SupplDosage sd ON dd.SupplementId = sd.SupplementId
                                    WHERE dd.IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                ) AS DosageSupplements)
                                ,0, @IssueCategory, GETDATE())";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
                        myCommand.Parameters.AddWithValue("@IssueCategory", question.IssueCategory);
                        myCommand.Parameters.AddWithValue("@UserGender", question.UserGender);
                        myCommand.Parameters.AddWithValue("@UserAge", question.UserAge);
                        myCommand.Parameters.AddWithValue("@PregnantOrFeeding", question.PregnantOrFeeding);
                        myCommand.Parameters.AddWithValue("@IssuesId", question.IssuesId);
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

        [HttpPost("PostFuncDiagnosticQuestions")]
        public JsonResult PostFuncDiagnosticQuestions(SupplSkinDiagnosticQuestions question)
        {
            Response response = new Response();

            try
            {
                string query = @"INSERT INTO dbo.SupplDiagnosticQuestions (UserId, IssueCategory, UserGender, UserAge, 
                                 PregnantOrFeeding, IssuesId, SolutionsId, IsDeleted)
                                 VALUES (@UserId, @IssueCategory, @UserGender, @UserAge, @PregnantOrFeeding, @IssuesId,
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))), 0);

                                 INSERT INTO dbo.SupplAdvice (UserId, IssuesId, SolutionsId, Issues, Solutions, SupplDosage, IsDeleted, IssueCategory, DiagnDate)
                                 VALUES (@UserId, @IssuesId, 
                                 (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS INT)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (SELECT STRING_AGG(Issue, ',') FROM dbo.DefSupplDealing WHERE IssueId IN (SELECT CAST(value AS VARCHAR)
                                 FROM STRING_SPLIT(@IssuesId, ','))),
                                 (
                                    SELECT STRING_AGG(IssueSupplement, ';') FROM (
                                        SELECT CONCAT(Issue, ': ', STRING_AGG(Supplement, ', ')) AS IssueSupplement
                                        FROM dbo.DefSupplDealing
                                        WHERE IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                        GROUP BY Issue
                                    ) AS IssueSupplements
                                ),
                                (SELECT STRING_AGG(DosageSupplement, '; ') AS SupplDosage
                                FROM (
                                    SELECT 
                                        CONCAT(dd.Supplement, ': ',
                                            CASE 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge <= 19 THEN sd.MkgTeen 
                                                WHEN @UserGender = 'Mężczyzna' AND @UserAge > 19 THEN sd.MkgAdult 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge <= 19 THEN sd.FkgTeen 
                                                WHEN @UserGender = 'Kobieta' AND @UserAge > 19 THEN sd.FkgAdult 
                                                ELSE 'Brak danych' 
                                            END
                                        ) AS DosageSupplement
                                    FROM dbo.DefSupplDealing dd
                                    INNER JOIN dbo.SupplDosage sd ON dd.SupplementId = sd.SupplementId
                                    WHERE dd.IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))
                                ) AS DosageSupplements)
                                ,0, @IssueCategory, GETDATE())";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
                        myCommand.Parameters.AddWithValue("@IssueCategory", question.IssueCategory);
                        myCommand.Parameters.AddWithValue("@UserGender", question.UserGender);
                        myCommand.Parameters.AddWithValue("@UserAge", question.UserAge);
                        myCommand.Parameters.AddWithValue("@PregnantOrFeeding", question.PregnantOrFeeding);
                        myCommand.Parameters.AddWithValue("@IssuesId", question.IssuesId);
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

        [HttpPut("SupplDiagnosticQuestions/{Id}")]
        public JsonResult Update(SupplSkinDiagnosticQuestions question, int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.SupplDiagnosticQuestions SET UserId = @UserId, 
                                IssueCategory = @IssueCategory, UserGender = @UserGender, 
                                UserAge = @UserAge, PregnantOrFeeding = @PregnantOrFeeding, 
                                IssuesId = @IssuesId, SolutionsId = (SELECT STRING_AGG(Id, ',') FROM dbo.DefSupplDealing 
                                WHERE IssueId IN (SELECT CAST(value AS INT) FROM STRING_SPLIT(@IssuesId, ','))), IssueCategory = @IssueCategory
                                WHERE Id = @Id";

                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("BYHCon");
                SqlDataReader myReader;
                using (SqlConnection myConn = new SqlConnection(sqlDataSource))
                {
                    myConn.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myConn))
                    {
                        myCommand.Parameters.AddWithValue("@Id", question.Id);
                        myCommand.Parameters.AddWithValue("@UserId", question.UserId);
                        myCommand.Parameters.AddWithValue("@IssueCategory", question.IssueCategory);
                        myCommand.Parameters.AddWithValue("@UserGender", question.UserGender);
                        myCommand.Parameters.AddWithValue("@UserAge", question.UserAge);
                        myCommand.Parameters.AddWithValue("@IssuesId", question.IssuesId);
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

        [HttpPut("Delete/{Id}")]
        public JsonResult Delete(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.SupplAdvice SET IsDeleted = 1
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
                    response.StatusMessage = "Workout Deleted Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Failed to Delete Workout";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }

        [HttpPut("Revert/{Id}")]
        public JsonResult Revert(int Id)
        {
            Response response = new Response();

            try
            {
                string query = @"UPDATE dbo.SupplDiagnosticQuestions SET IsDeleted = 0
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
                    response.StatusMessage = "Workout Reverted Successfully";
                    HttpContext.Response.StatusCode = response.StatusCode;
                    response.Data = table;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");

                response.StatusCode = 100;
                response.StatusMessage = "Failed to Revert Workout";
                HttpContext.Response.StatusCode = response.StatusCode;
            }

            return new JsonResult(response);
        }
    }
}
