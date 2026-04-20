using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimsoftSignature.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserAndSignatureRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.RenameColumn(
                name: "Telephone",
                table: "Signatures",
                newName: "NomSignature");

            migrationBuilder.AddColumn<string>(
                name: "Adresse",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailPro",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Instagram",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedIn",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nom",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NomEntreprise",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Poste",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prenom",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SiteWeb",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TelBureau",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TelMobile",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Youtube",
                table: "Utilisateurs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Statut",
                table: "Signatures",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Adresse",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "EmailPro",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Instagram",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "LinkedIn",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Nom",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "NomEntreprise",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Poste",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Prenom",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "SiteWeb",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "TelBureau",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "TelMobile",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Youtube",
                table: "Utilisateurs");

            migrationBuilder.DropColumn(
                name: "Statut",
                table: "Signatures");

            migrationBuilder.RenameColumn(
                name: "NomSignature",
                table: "Signatures",
                newName: "Telephone");

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
        }
    }
}
