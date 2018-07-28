const Postgres = require('pg');
const Promise = require('bluebird');

module.exports = function() {
    return new Promise((resolve, reject) => {
        const db = new Postgres.Client({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: 'postgres',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT
        });

        db.connect((err) => {
            if (err) reject(err);
            db.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`, (err) => {
                if (err) reject(err);
                db.query(`CREATE DATABASE ${process.env.DB_NAME}`, (err) => {
                    if (err) reject(err);
                    db.end()
                    resolve();
                })
            })
        })
    })
}