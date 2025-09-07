import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('quotations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('type', 255).notNullable().defaultTo('proposal');
    table.uuid('industry_id').notNullable();
    table.decimal('base_price', 15, 2).notNullable();
    table.string('risk_level', 255).notNullable().defaultTo('normal');
    table.string('code_number', 255).notNullable();
    table.uuid('contact_id').notNullable();
    table.date('valid_from').notNullable();
    table.date('valid_end').notNullable();
    table.text('description').notNullable();
    table.json('data').nullable();
    table.string('status', 255).notNullable().defaultTo('active');
    table.boolean('is_template').notNullable().defaultTo(false);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('industry_id');
    table.index('contact_id');
    table.index('type');
    table.index('status');
    table.index('code_number');
    table.index('valid_from');
    table.index('valid_end');
    table.index('is_template');

    // Create foreign key constraints
    table.foreign('industry_id', 'quotations_industry_id_foreign')
      .references('id')
      .inTable('organization_industries')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('contact_id', 'quotations_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('quotations');
}
