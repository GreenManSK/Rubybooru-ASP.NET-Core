using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rubybooru.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePreviewTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ImagePreviews",
                columns: table => new
                {
                    ImageId = table.Column<int>(type: "INTEGER", nullable: false),
                    Width = table.Column<int>(type: "INTEGER", nullable: false),
                    Height = table.Column<int>(type: "INTEGER", nullable: false),
                    KeepAspectRatio = table.Column<bool>(type: "INTEGER", nullable: false),
                    PreviewData = table.Column<byte[]>(type: "BLOB", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImagePreviews", x => new { x.ImageId, x.Width, x.Height, x.KeepAspectRatio });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImagePreviews");
        }
    }
}
