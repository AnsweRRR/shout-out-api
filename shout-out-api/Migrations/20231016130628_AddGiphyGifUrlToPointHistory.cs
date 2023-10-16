using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shout_out_api.Migrations
{
    /// <inheritdoc />
    public partial class AddGiphyGifUrlToPointHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GiphyGifUrl",
                table: "PointHistories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(2023, 10, 16, 13, 6, 27, 953, DateTimeKind.Utc).AddTicks(8264));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiphyGifUrl",
                table: "PointHistories");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(2023, 8, 31, 15, 7, 43, 733, DateTimeKind.Utc).AddTicks(4332));
        }
    }
}
