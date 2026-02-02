using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bran.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTableComplianceConfigs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "Amount",
                table: "Transactions",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.CreateTable(
                name: "ComplianceConfigs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RuleName = table.Column<string>(type: "text", nullable: false),
                    Key = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplianceConfigs", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "ComplianceConfigs",
                columns: new[] { "Id", "Key", "RuleName", "Value" },
                values: new object[,]
                {
                    { new Guid("55555555-5555-5555-5555-555555555555"), "DailyLimit", "TransactionDailyLimitRule", "5000" },
                    { new Guid("66666666-6666-6666-6666-666666666666"), "ThresholdAmount", "TransactionStructuringRule", "100000" },
                    { new Guid("77777777-7777-7777-7777-777777777777"), "MinTransactionCount", "TransactionStructuringRule", "5" },
                    { new Guid("88888888-8888-8888-8888-888888888888"), "DaysWindow", "TransactionStructuringRule", "7" },
                    { new Guid("99999999-9999-9999-9999-999999999999"), "ThresholdAmount", "LargeTransactionRule", "50000" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "MaxFailedLogins", "SuspiciousUserActivityRule", "3" },
                    { new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "LockoutDurationMinutes", "SuspiciousUserActivityRule", "30" }
                });

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "RiskLevel",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "RiskLevel",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "RiskLevel",
                value: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComplianceConfigs");

            migrationBuilder.AlterColumn<decimal>(
                name: "Amount",
                table: "Transactions",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                column: "RiskLevel",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                column: "RiskLevel",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Countries",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                column: "RiskLevel",
                value: 10);
        }
    }
}
