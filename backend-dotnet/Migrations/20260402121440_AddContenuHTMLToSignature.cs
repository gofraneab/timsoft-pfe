using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimsoftSignature.Migrations
{
    /// <inheritdoc />
    public partial class AddContenuHTMLToSignature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContenuHTML",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContenuHTML",
                table: "Signatures");
        }
    }
}
