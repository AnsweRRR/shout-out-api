using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shout_out_api.Migrations
{
    /// <inheritdoc />
    public partial class Add_Reward_To_Notification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RewardId",
                table: "Notifications",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(1999, 9, 23, 12, 12, 12, 485, DateTimeKind.Utc));

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_RewardId",
                table: "Notifications",
                column: "RewardId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Rewards_RewardId",
                table: "Notifications",
                column: "RewardId",
                principalTable: "Rewards",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Rewards_RewardId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_RewardId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "RewardId",
                table: "Notifications");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "VerifiedAt",
                value: new DateTime(2023, 10, 22, 19, 0, 14, 418, DateTimeKind.Utc).AddTicks(7650));
        }
    }
}
