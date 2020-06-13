using Microsoft.EntityFrameworkCore.Migrations;

namespace Rubybooru.Data.Migrations
{
    public partial class imagesideratio : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "SideRatio",
                table: "Images",
                nullable: false,
                defaultValue: 0.0);
            migrationBuilder.Sql("UPDATE Images SET SideRatio = Width / Height");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SideRatio",
                table: "Images");
        }
    }
}
