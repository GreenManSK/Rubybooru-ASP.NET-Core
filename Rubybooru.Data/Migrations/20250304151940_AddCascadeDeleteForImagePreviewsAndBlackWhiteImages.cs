using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rubybooru.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeDeleteForImagePreviewsAndBlackWhiteImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "ImageId",
                table: "BlackWhiteImages",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddForeignKey(
                name: "FK_BlackWhiteImages_Images_ImageId",
                table: "BlackWhiteImages",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ImagePreviews_Images_ImageId",
                table: "ImagePreviews",
                column: "ImageId",
                principalTable: "Images",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlackWhiteImages_Images_ImageId",
                table: "BlackWhiteImages");

            migrationBuilder.DropForeignKey(
                name: "FK_ImagePreviews_Images_ImageId",
                table: "ImagePreviews");

            migrationBuilder.AlterColumn<int>(
                name: "ImageId",
                table: "BlackWhiteImages",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);
        }
    }
}
