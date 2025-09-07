import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('warehouse_addresses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('warehouse_id').notNullable();
    table.uuid('country_id').notNullable();
    table.uuid('province_id').notNullable();
    table.uuid('city_id').notNullable();
    table.uuid('district_id').notNullable();
    table.uuid('subdistrict_id').nullable();
    table.string('address', 512).notNullable();
    table.string('address2', 512).nullable();
    table.string('rtrw', 255).nullable();
    table.string('postalcode', 5).nullable();
    table.float('latitude').nullable();
    table.float('longitude').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('warehouse_id');
    table.index('country_id');
    table.index('province_id');
    table.index('city_id');
    table.index('district_id');
    table.index('subdistrict_id');
    table.index('postalcode');

    // Create foreign key constraints
    table.foreign('warehouse_id', 'warehouse_addresses_warehouse_id_foreign')
      .references('id')
      .inTable('warehouses')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('warehouse_addresses');
}
