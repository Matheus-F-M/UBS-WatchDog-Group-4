using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bran.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIdCountry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("2cdadad3-bc2f-4937-a312-28af65045cb8"));

            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("5dd83009-84b4-4696-86f9-8014697fc666"));

            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("e20e16e1-6705-469d-9925-12b988221a6c"));

            migrationBuilder.InsertData(
                table: "Countries",
                columns: new[] { "Id", "CountryCode", "Name", "RiskLevel" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "BR", "Brazil", 0 },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "MX", "Mexico", 1 },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "IR", "Iran", 10 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.InsertData(
                table: "Countries",
                columns: new[] { "Id", "CountryCode", "Name", "RiskLevel" },
                values: new object[,]
                {
                    { new Guid("2cdadad3-bc2f-4937-a312-28af65045cb8"), "IR", "Iran", 10 },
                    { new Guid("5dd83009-84b4-4696-86f9-8014697fc666"), "BR", "Brazil", 0 },
                    { new Guid("e20e16e1-6705-469d-9925-12b988221a6c"), "KP", "North Korea", 10 }
                });
        }
    }
}
