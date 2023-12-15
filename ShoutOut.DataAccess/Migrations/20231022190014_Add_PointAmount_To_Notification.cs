using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoutOut.Migrations
{
    /// <inheritdoc />
    public partial class Add_PointAmount_To_Notification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PointAmount",
                table: "Notifications",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(2023, 10, 22, 19, 0, 14, 418, DateTimeKind.Utc).AddTicks(7650));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PointAmount",
                table: "Notifications");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(2023, 10, 22, 14, 52, 4, 485, DateTimeKind.Utc).AddTicks(2290));
        }
    }
}
