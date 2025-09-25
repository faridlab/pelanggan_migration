import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const types = ['paid', 'unpaid'];
  return knex.schema.createTable('timeoffs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.string('name', 255).notNullable();
    table.enum('type', types).notNullable().defaultTo('paid');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('organization_id');

    // Create foreign key constraint
    table.foreign('organization_id', 'timeoffs_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraint for type values
    table.check('?? IN (?, ?)', ['type', 'paid', 'unpaid']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('timeoffs');
}
