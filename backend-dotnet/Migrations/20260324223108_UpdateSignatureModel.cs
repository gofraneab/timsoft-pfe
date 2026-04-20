using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimsoftSignature.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSignatureModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Nom",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Poste",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Prenom",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Telephone",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "NomSignature",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "Statut",
                table: "Signatures");

            migrationBuilder.RenameColumn(
                name: "Template",
                table: "Signatures",
                newName: "TypeTemplate");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "MotDePasse",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailPro",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nom",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Poste",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prenom",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Telephone",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Nom",
                table: "Departements",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Departements",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MotDePasse",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "EmailPro",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "Nom",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "Poste",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "Prenom",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "Telephone",
                table: "Signatures");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Departements");

            migrationBuilder.RenameColumn(
                name: "TypeTemplate",
                table: "Signatures",
                newName: "Template");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Nom",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Poste",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Prenom",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telephone",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NomSignature",
                table: "Signatures",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Statut",
                table: "Signatures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Nom",
                table: "Departements",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
