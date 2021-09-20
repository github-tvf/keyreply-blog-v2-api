import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNullableFromAuthorIdColumnOfBlogTable1632039064817
  implements MigrationInterface
{
  name = 'RemoveNullableFromAuthorIdColumnOfBlogTable1632039064817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."blog" DROP CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."blog" ALTER COLUMN "authorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."blog" ADD CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."blog" DROP CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."blog" ALTER COLUMN "authorId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."blog" ADD CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
