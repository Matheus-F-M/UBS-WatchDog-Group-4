using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bran.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ForceAddColumnIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Clients",
                nullable: false,
                defaultValue: true
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Clients"
            );
        }
    }
}
