import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('subdistricts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.uuid('district_id').notNullable();
    table.uuid('country_id').nullable();
    table.uuid('province_id').nullable();
    table.uuid('city_id').nullable();
    table.float('latitude').nullable();
    table.float('longitude').nullable();
    table.string('postal_code').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create foreign key constraints
    table.foreign('district_id', 'subdistricts_district_id_foreign')
      .references('id')
      .inTable('districts')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('country_id', 'subdistricts_country_id_foreign')
      .references('id')
      .inTable('countries')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('province_id', 'subdistricts_province_id_foreign')
      .references('id')
      .inTable('provinces')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('city_id', 'subdistricts_city_id_foreign')
      .references('id')
      .inTable('cities')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('subdistricts');
}
