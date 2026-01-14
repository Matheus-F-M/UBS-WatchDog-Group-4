using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bran.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TryRemoveCountryColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Remove a coluna "Country" da tabela "Transactions"
            migrationBuilder.DropColumn(
                name: "Country",
                table: "Transactions"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
         
            migrationBuilder.AddColumn<string>(
            name: "Country",
            table: "Transactions",
            type: "text", // ou "text" se for Postgres
            nullable: true
            );
        }
    }
}
