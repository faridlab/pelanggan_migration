import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const ptkp_status = ['TK/0', 'TK/1', 'TK/2', 'TK/3', 'K/0', 'K/1', 'K/2', 'K/3'];
  const tax_methods = ['gross', 'gross-up', 'netto'];
  const tax_salary = ['taxable', 'non-taxable'];
  const tax_statuses = [
      'EMP-PRM',
      'EMP-XPRM',
      'XEMP-CTN',
      'XEMP-XCTN',
      'XPT',
      'XPT-DN',
      'XPRT-CTN',
      'XPRT-XCTN',
      'COMM',
      'XPRT-CTN01',
      'FRL',
      'XEMP-XCTN01',
  ];

  // TAX STATUS:
  // ===========
  // EMP-PRM: Pegawai tetap
  // EMP-XPRM: Pegawai tidak tetap
  // XEMP-CTN: Bukan pegawai yang bersifat berkesinambungan
  // XEMP-XCTN: Bukan pegawai yang tidak bersifat berkesinambungan
  // XPT: Ekspatriat
  // XPT-DN: Ekspatriat dalam negeri
  // XPRT-CTN: Tenaga ahli yang bersifat berkesinambungan
  // XPRT-XCTN: Tenaga ahli yang tidak bersifat berkesinambungan
  // COMM: Dewan komisaris
  // XPRT-CTN01: Tenaga ahli yang bersifat berkesinambungan >1 PK
  // FRL: Tenaga kerja lepas
  // XEMP-XCTN01: Bukan pegawai yang bersifat berkesinambungan >1 PK

  await knex.schema.createTable('employee_taxes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('npwp_number', 255).notNullable();
    table.enum('ptkp_status', ptkp_status).notNullable().defaultTo('TK/0');
    table.enum('tax_method', tax_methods).notNullable().defaultTo('gross');
    table.enum('tax_salary', tax_salary).notNullable().defaultTo('taxable');
    table.date('taxable_date').notNullable();
    table.enum('tax_status', tax_statuses).notNullable().defaultTo('EMP-PRM');
    table.integer('beginning_netto').nullable();
    table.integer('pph21_paid').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('npwp_number');
    table.index('tax_status');

    // Create foreign key constraint
    table.foreign('employee_id', 'employee_taxes_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });

  // Create a function to update the updated_at column
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create a trigger to call the function on UPDATE
  await knex.raw(`
    CREATE TRIGGER update_employee_taxes_updated_at
    BEFORE UPDATE ON employee_taxes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_employee_taxes_updated_at ON employee_taxes;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('employee_taxes');
}
