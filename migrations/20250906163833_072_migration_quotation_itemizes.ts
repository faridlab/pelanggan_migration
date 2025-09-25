import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('quotation_itemizes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('category_id').nullable();
    table.uuid('industry_id').nullable();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('category_id');
    table.index('industry_id');

    // Create foreign key constraints
    table.foreign('industry_id', 'quotation_itemizes_industry_id_foreign')
      .references('id')
      .inTable('industries')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('category_id', 'quotation_itemizes_category_id_foreign')
      .references('id')
      .inTable('industries')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('quotation_itemizes');
}
