const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { exec } = require('child_process');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const config = require('./config.json');

const BACKUP_DIR = path.join(__dirname, 'backups');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const backupDanKirimKeDiscord = () => {
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
    const sqlFileName = `backup_${config.DB_NAME}_${timestamp}.sql`;
    const zipFileName = `backup_${config.DB_NAME}_${timestamp}.zip`;
    const sqlFilePath = path.join(BACKUP_DIR, sqlFileName);
    const zipFilePath = path.join(BACKUP_DIR, zipFileName);

    const dumpCommand = config.DB_PASS 
        ? `mysqldump -h ${config.DB_HOST} -u ${config.DB_USER} -p"${config.DB_PASS}" ${config.DB_NAME} > "${sqlFilePath}"`
        : `mysqldump -h ${config.DB_HOST} -u ${config.DB_USER} ${config.DB_NAME} > "${sqlFilePath}"`;

    exec(dumpCommand, (error) => {
        if (error) {
            console.error(error.message);
            return;
        }

        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', async () => {
            try {
                const channel = await client.channels.fetch(config.CHANNEL_ID);
                if (!channel) return;

                const stats = fs.statSync(zipFilePath);
                const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

                const attachment = new AttachmentBuilder(zipFilePath);
                
                const messageContent = `📦 **Auto-Backup Database Berhasil!**\n\n📅 **Waktu:** \`${timestamp} WIB\`\n🌐 **Host:** \`${config.DB_HOST}\`\n🗄️ **Database:** \`${config.DB_NAME}\`\n📁 **Nama File:** \`${zipFileName}\`\n⚖️ **Ukuran:** \`${fileSizeInMB} MB\``;

                await channel.send({
                    content: messageContent,
                    files: [attachment]
                });

                fs.unlinkSync(sqlFilePath);
            } catch (err) {
                console.error(err.message);
            }
        });

        archive.on('error', (err) => {
            console.error(err.message);
        });

        archive.pipe(output);
        archive.file(sqlFilePath, { name: sqlFileName });
        archive.finalize();
    });
};

client.once('ready', () => {
    console.log(`Bot login: ${client.user.tag}`);
    
    const [jam, menit] = config.JADWAL_BACKUP.split(':');
    
    cron.schedule(`${menit} ${jam} * * *`, () => {
        backupDanKirimKeDiscord();
    }, {
        scheduled: true,
        timezone: "Asia/Jakarta"
    });
    
    console.log(`Jadwal backup diatur pada ${config.JADWAL_BACKUP} WIB`);
});

client.login(config.DISCORD_TOKEN);
