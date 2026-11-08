const Sequelize = require('sequelize');

class DatabaseManager {
    static instance = null;

    static getInstance() {
        if (!DatabaseManager.instance) {
            const DATABASE_URL = process.env.DATABASE_URL || './database.db';
            const isSQLite = DATABASE_URL === './database.db' || DATABASE_URL.endsWith('.db');

            console.log(`🗄️ Database: ${isSQLite ? 'SQLite' : 'PostgreSQL'} Mode`);

            DatabaseManager.instance = isSQLite
                ? new Sequelize({
                      dialect: 'sqlite',
                      storage: DATABASE_URL,
                      logging: false,
                      pool: {
                          max: 5,
                          min: 0,
                          acquire: 30000,
                          idle: 10000
                      }
                  })
                : new Sequelize(DATABASE_URL, {
                      dialect: 'postgres',
                      ssl: true,
                      protocol: 'postgres',
                      dialectOptions: {
                          native: true,
                          ssl: { require: true, rejectUnauthorized: false },
                      },
                      logging: false,
                      pool: {
                          max: 10,
                          min: 2,
                          acquire: 60000,
                          idle: 10000
                      },
                      retry: {
                          max: 3
                      }
                  });
        }
        return DatabaseManager.instance;
    }
}

const DATABASE = DatabaseManager.getInstance();

// ===== Connection Test & Sync =====
DATABASE.authenticate()
    .then(() => {
        console.log('✅ Database connection OK');
        return DATABASE.sync({ alter: false }); // FIX: alter true දැම්මොත් data නැතිවෙනවා!
    })
    .then(() => {
        console.log('🎀 YUMI MINI V1 Database Connected Successfully!');
    })
    .catch((error) => {
        console.error('❌ Error synchronizing the database:', error.message);
        // Auto fallback to SQLite if PG fails
        if (process.env.DATABASE_URL && process.env.DATABASE_URL !== './database.db') {
            console.log('⚠️ Falling back to SQLite...');
            delete process.env.DATABASE_URL;
            DatabaseManager.instance = null;
            // Retry will happen on next import
        }
    });

// Handle graceful shutdown
process.on('SIGINT', async () => {
    try {
        await DATABASE.close();
        console.log('🗄️ Database closed gracefully');
    } catch {}
    process.exit(0);
});

module.exports = { DATABASE, DatabaseManager };