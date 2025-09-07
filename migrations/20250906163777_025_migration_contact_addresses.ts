import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('contact_addresses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable();
    table.string('type', 255).notNullable().defaultTo('home');
    table.string('type_other', 255).nullable();
    table.string('country', 255).nullable();
    table.string('province', 255).nullable();
    table.string('city', 255).nullable();
    table.string('address', 512).notNullable();
    table.string('address2', 512).nullable();
    table.string('postalcode', 5).nullable();
    table.float('latitude').nullable();
    table.float('longitude').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('contact_id');
    table.index('type');
    table.index('country');
    table.index('province');
    table.index('city');

    // Create foreign key constraint
    table.foreign('contact_id', 'contact_addresses_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('contact_addresses');
}
