import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const types = ['proposal', 'quote', 'estimate', 'other'];
  const risk_levels = ['low', 'normal', 'medium', 'high', 'critical'];
  const statuses = ['active', 'inactive', 'draft'];
  return knex.schema.createTable('quotations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.enum('type', types).notNullable().defaultTo('proposal').comment('proposal for lead, and estimate for client');
    table.uuid('industry_id').notNullable();
    table.decimal('base_price', 15, 2).notNullable();
    table.enum('risk_level', risk_levels).notNullable().defaultTo('normal').comment('normal: {base_price} x 1, medium: {base_price} x 3, high: {base_price} x 5');
    table.string('code_number', 255).notNullable().comment('ex: 001/{QUO|EST|INV}/{PROJECT CODE}/IV/2023');
    table.uuid('contact_id').notNullable();
    table.date('valid_from').notNullable();
    table.date('valid_end').notNullable();
    table.text('description').notNullable();
    table.json('data').nullable();
    table.enum('status', statuses).notNullable().defaultTo('draft');
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
      .inTable('industries')
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
