using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TimsoftSignature.Domain.Entities;

namespace TimsoftSignature.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Signature> Signatures { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Utilisateurs");
                entity.Property(e => e.FirstName).HasColumnName("Prenom");
                entity.Property(e => e.LastName).HasColumnName("Nom");
                entity.Property(e => e.Position).HasColumnName("Poste");
                entity.Property(e => e.CompanyName).HasColumnName("NomEntreprise");
                entity.Property(e => e.OfficePhone).HasColumnName("TelBureau");
                entity.Property(e => e.MobilePhone).HasColumnName("TelMobile");
                entity.Property(e => e.Address).HasColumnName("Adresse");
                entity.Property(e => e.WebsiteUrl).HasColumnName("SiteWeb");
                entity.Property(e => e.LinkedInUrl).HasColumnName("LinkedIn");
                entity.Property(e => e.YoutubeUrl).HasColumnName("Youtube");
                entity.Property(e => e.InstagramUrl).HasColumnName("Instagram");
                entity.Property(e => e.BusinessEmail).HasColumnName("EmailPro");
                entity.Property(e => e.LogoUrl).HasColumnName("LogoUrl");
                entity.Property(e => e.PhotoUrl).HasColumnName("PhotoUrl");
                entity.Property(e => e.Email).HasColumnName("Email");
                entity.Property(e => e.Password).HasColumnName("MotDePasse");
                entity.Property(e => e.Role).HasColumnName("Role");
                entity.Property(e => e.DepartmentId).HasColumnName("DepartementId");
            });

            modelBuilder.Entity<Department>(entity =>
            {
                entity.ToTable("Departements");
                entity.Property(e => e.Name).HasColumnName("Nom");
                entity.Property(e => e.Description).HasColumnName("Description");
            });

            modelBuilder.Entity<Signature>(entity =>
            {
                entity.ToTable("Signatures");
                entity.Property(e => e.SignatureName).HasColumnName("NomSignature");
                entity.Property(e => e.Status).HasColumnName("Statut");
                entity.Property(e => e.TypeTemplate).HasColumnName("TypeTemplate");
                entity.Property(e => e.CreatedAt).HasColumnName("DateCreation");
                entity.Property(e => e.ContenuHTML).HasColumnName("ContenuHTML");
                entity.Property(e => e.DepartmentId).HasColumnName("DepartementId");
            });
            // Relation User → Department
            modelBuilder.Entity<User>()
                .HasOne(u => u.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relation Signature → Department
            modelBuilder.Entity<Signature>()
                .HasOne(s => s.Department)
                .WithMany(d => d.Signatures)
                .HasForeignKey(s => s.DepartmentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
