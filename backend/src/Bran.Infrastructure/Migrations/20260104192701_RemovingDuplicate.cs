using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bran.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovingDuplicate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                columns: new[] { "CountryCode", "Name" },
                values: new object[] { "MM", "Myanmar" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                columns: new[] { "CountryCode", "Name" },
                values: new object[] { "IR", "Iran" });

            migrationBuilder.InsertData(
                table: "Countries",
                columns: new[] { "Id", "CountryCode", "Name", "RiskLevel" },
                values: new object[] { new Guid("55555555-5555-5555-5555-555555555555"), "MM", "Myanmar", 10 });
        }
    }
}
