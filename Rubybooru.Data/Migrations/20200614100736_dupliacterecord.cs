using Microsoft.EntityFrameworkCore.Migrations;
using MySql.Data.EntityFrameworkCore.Metadata;

namespace Rubybooru.Data.Migrations
{
    public partial class dupliacterecord : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DuplicateCheck",
                table: "Images",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "DuplicateRecord",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ImageAId = table.Column<int>(nullable: false),
                    ImageBId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DuplicateRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DuplicateRecord_Images_ImageAId",
                        column: x => x.ImageAId,
                        principalTable: "Images",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DuplicateRecord_Images_ImageBId",
                        column: x => x.ImageBId,
                        principalTable: "Images",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DuplicateRecord_ImageAId",
                table: "DuplicateRecord",
                column: "ImageAId");

            migrationBuilder.CreateIndex(
                name: "IX_DuplicateRecord_ImageBId",
                table: "DuplicateRecord",
                column: "ImageBId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DuplicateRecord");

            migrationBuilder.DropColumn(
                name: "DuplicateCheck",
                table: "Images");
        }
    }
}
