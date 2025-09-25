import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('districts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.uuid('city_id').notNullable();
    table.uuid('country_id').nullable();
    table.uuid('province_id').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create foreign key constraints
    table.foreign('city_id', 'districts_city_id_foreign')
      .references('id')
      .inTable('cities')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('country_id', 'districts_country_id_foreign')
      .references('id')
      .inTable('countries')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('province_id', 'districts_province_id_foreign')
      .references('id')
      .inTable('provinces')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('districts');
}
