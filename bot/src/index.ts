import { Client, GatewayIntentBits, Partials } from 'discord.js';
import express from 'express';
import dotenv from 'dotenv';
import { handleVerificationSubmit, handleButtonInteraction } from './events/verification';

dotenv.config();

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// Express Server (for receiving webhooks from web app)
const app = express();
app.use(express.json());

// Verify API secret middleware
const verifyApiSecret = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiSecret = req.headers['x-api-secret'];
  if (apiSecret !== process.env.API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Bot ready event
client.once('ready', () => {
  console.log(`🤖 Bot logged in as ${client.user?.tag}`);
  console.log(`📊 Serving ${client.guilds.cache.size} guild(s)`);
});

// Handle button interactions (Pass/Fail buttons on verification embeds)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  
  if (interaction.customId.startsWith('verify_')) {
    await handleButtonInteraction(client, interaction);
  }
});

// API Routes

// Receive new verification submission from web app
app.post('/api/verification/submit', verifyApiSecret, async (req, res) => {
  try {
    const { attemptId, user, answers, integrityFlags, questions } = req.body;
    await handleVerificationSubmit(client, {
      attemptId,
      user,
      answers,
      integrityFlags,
      questions,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error handling verification submit:', error);
    res.status(500).json({ error: 'Failed to handle verification' });
  }
});

// Update user roles after verification decision
app.post('/api/roles/update', verifyApiSecret, async (req, res) => {
  try {
    const { discordId, decision } = req.body;
    
    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID!);
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch(discordId).catch(() => null);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    if (decision === 'PASSED') {
      // Add verified role, remove unverified
      if (process.env.VERIFIED_ROLE_ID) {
        await member.roles.add(process.env.VERIFIED_ROLE_ID);
      }
      if (process.env.UNVERIFIED_ROLE_ID) {
        await member.roles.remove(process.env.UNVERIFIED_ROLE_ID).catch(() => {});
      }
      
      // Send DM to user
      try {
        await member.send({
          content: `🎉 **تهانينا!**\n\nتم قبول طلب التحقق الخاص بك في **Secret CFW**!\nيمكنك الآن الانضمام للخادم والاستمتاع بتجربة الرول بلاي.`,
        });
      } catch (error) {
        console.log('Could not send DM to user');
      }
    } else {
      // Send rejection DM
      try {
        await member.send({
          content: `❌ **للأسف**\n\nتم رفض طلب التحقق الخاص بك في **Secret CFW**.\nيرجى مراجعة القوانين والتقديم مرة أخرى.`,
        });
      } catch (error) {
        console.log('Could not send DM to user');
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating roles:', error);
    res.status(500).json({ error: 'Failed to update roles' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Start Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌐 API Server running on port ${PORT}`);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
