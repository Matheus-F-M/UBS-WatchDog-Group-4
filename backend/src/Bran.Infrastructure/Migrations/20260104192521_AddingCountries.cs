using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bran.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddingCountries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CountryCode", "Name", "RiskLevel" },
                values: new object[] { "KP", "North Korea", 10 });

            migrationBuilder.InsertData(
                table: "Countries",
                columns: new[] { "Id", "CountryCode", "Name", "RiskLevel" },
                values: new object[,]
                {
                    { new Guid("44444444-4444-4444-4444-444444444444"), "IR", "Iran", 10 },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "MM", "Myanmar", 10 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CountryCode", "Name", "RiskLevel" },
                values: new object[] { "MX", "Mexico", 1 });
        }
    }
}
