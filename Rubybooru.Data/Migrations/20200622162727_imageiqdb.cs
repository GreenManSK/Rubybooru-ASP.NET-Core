using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Rubybooru.Data.Migrations
{
    public partial class imageiqdb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "IqdbCheckDateTime",
                table: "Images",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IqdbCheckDateTime",
                table: "Images");
        }
    }
}
