/**
 * Migration runner for the Handloom Saree backend.
 *
 * Reads migration files from backend/migrations/, tracks applied migrations in
 * a `migrations` tracking table, and runs pending migrations in order inside a
 * transaction.
 *
 * CLI usage (run from backend/):   node scripts/runMigrations.js
 * Programmatic: import { runPendingMigrations } from "./scripts/runMigrations.js"
 */

import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIGRATIONS_DIR = path.resolve(__dirname, "..", "migrations");
const TRACKING_TABLE = "migrations";

const MigrationTracker = sequelize.define(
  TRACKING_TABLE,
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ranAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: TRACKING_TABLE, timestamps: false }
);

async function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".cjs"))
    .sort()
    .map((file) => path.join(MIGRATIONS_DIR, file));
}

async function getAppliedMigrationNames() {
  await MigrationTracker.sync({ alter: false });
  const rows = await MigrationTracker.findAll({ attributes: ["name"] });
  return new Set(rows.map((row) => row.name));
}

/**
 * Runs all pending migrations. Returns an array of applied migration names.
 * Does NOT close the sequelize connection (caller owns the lifecycle).
 */
export async function runPendingMigrations() {
  await MigrationTracker.sync({ alter: false });
  const applied = await getAppliedMigrationNames();

  const files = await getMigrationFiles();
  const appliedNames = new Set(applied);

  const pending = [];
  for (const file of files) {
    const mod = await import(`file:///${file.replace(/\\/g, "/")}`);
    const migration = mod.default || mod;
    const name = migration.name || path.basename(file, ".cjs");
    if (!appliedNames.has(name)) {
      pending.push({ file, migration, name });
    }
  }

  if (pending.length === 0) {
    console.log("No pending migrations. Database is up to date.");
    return [];
  }

  console.log(`Found ${pending.length} pending migration(s).`);
  const appliedNow = [];

  for (const { file, migration, name } of pending) {
    console.log(`Running migration: ${name} ...`);
    const t = await sequelize.transaction();
    try {
      await migration.up(sequelize.getQueryInterface(), DataTypes);
      await MigrationTracker.create({ name }, { transaction: t });
      await t.commit();
      appliedNow.push(name);
      console.log(`Migration "${name}" applied successfully.`);
    } catch (error) {
      await t.rollback();
      console.error(`Migration "${name}" failed:`, error.message);
      throw error;
    }
  }

  console.log("All migrations applied successfully.");
  return appliedNow;
}

// CLI entry point
if (path.basename(process.argv[1]) === "runMigrations.js") {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Database authenticated for migration runner");
      await runPendingMigrations();
      await sequelize.close();
    } catch (error) {
      console.error("Migration runner error:", error);
      await sequelize.close().catch(() => {});
      process.exit(1);
    }
  })();
}
