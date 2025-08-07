// Importaciones necesarias
import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

// 🔵 Inicializa Express
const app = express();

app.get('/', (req, res) => {
  res.send('Bot de Discord activo 🟢');
});

app.listen(3000, () => {
  console.log('🌐 Servidor Express corriendo en el puerto 3000');
});

// 🤖 Inicializa el bot de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  updateBotCount();
  setInterval(updateBotCount, 1000); // actualiza cada segundo
});

async function updateBotCount() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch(); // carga los miembros

    const bots = guild.members.cache.filter(member => member.user.bot).size;

    const channel = await guild.channels.fetch(CHANNEL_ID);
    await channel.setName(`🤖 Bots: ${bots}`);
    console.log(`Actualizado: Bots = ${bots}`);
  } catch (error) {
    console.error('❌ Error al actualizar:', error.message);
  }
}

// Manejo de eventos para errores y reconexión
client.on('error', error => {
  console.error('❌ Error del cliente Discord:', error);
});

client.on('warn', info => {
  console.warn('⚠️ Advertencia Discord:', info);
});

client.on('shardDisconnect', (event, shardId) => {
  console.warn(`⚠️ Shard ${shardId} desconectado. Intentando reconectar...`);
});

client.on('shardReconnecting', shardId => {
  console.log(`🔄 Shard ${shardId} intentando reconectar...`);
});

client.on('disconnect', event => {
  console.warn(`⚠️ Bot desconectado, código: ${event.code}. Reconectando...`);
  client.login(process.env.TOKEN).catch(console.error);
});

// Captura errores no manejados para evitar que el bot caiga
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rechazo no manejado:', reason);
});

process.on('uncaughtException', error => {
  console.error('❌ Excepción no atrapada:', error);
});

// Login del bot
client.login(process.env.TOKEN);