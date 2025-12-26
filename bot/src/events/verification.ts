import {
  Client,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ColorResolvable,
} from 'discord.js';

interface VerificationData {
  attemptId: string;
  user: {
    discordId: string;
    username: string;
    avatar?: string;
  };
  answers: Array<{
    question: string;
    answer: string;
  }>;و
  integrityFlags: {
    copyPasteCount: number;
    tabSwitchCount: number;
  };
  questions: Array<{
    id: string;
    content: string;
  }>;
}

// Send verification embed to admin channel
export async function handleVerificationSubmit(client: Client, data: VerificationData) {
  const channel = client.channels.cache.get(process.env.ADMIN_CHANNEL_ID!) as TextChannel;
  
  if (!channel) {
    console.error('Admin channel not found');
    return;
  }

  // Build the embed
  const hasIntegrityIssues = 
    data.integrityFlags.copyPasteCount > 0 || 
    data.integrityFlags.tabSwitchCount > 0;

  const embedColor: ColorResolvable = hasIntegrityIssues ? 0xf59e0b : 0x06b6d4;

  const embed = new EmbedBuilder()
    .setColor(embedColor)
    .setTitle('📋 طلب تحقق جديد')
    .setDescription(`<@${data.user.discordId}> قدم طلب تحقق`)
    .addFields(
      { name: '👤 المستخدم', value: data.user.username, inline: true },
      { name: '🆔 Discord ID', value: data.user.discordId, inline: true },
      { name: '⏰ التوقيت', value: new Date().toLocaleString('ar-SA'), inline: true },
    )
    .setTimestamp();

  // Add integrity warnings if any
  if (hasIntegrityIssues) {
    embed.addFields({
      name: '⚠️ تحذيرات النزاهة',
      value: [
        data.integrityFlags.tabSwitchCount > 0 ? `• تبديل التبويب: ${data.integrityFlags.tabSwitchCount} مرات` : '',
        data.integrityFlags.copyPasteCount > 0 ? `• نسخ/لصق: ${data.integrityFlags.copyPasteCount} مرات` : '',
      ].filter(Boolean).join('\n'),
      inline: false,
    });
  }

  // Add answers
  data.answers.forEach((answer, index) => {
    embed.addFields({
      name: `❓ السؤال ${index + 1}`,
      value: `**${answer.question}**\n📝 ${answer.answer}`,
      inline: false,
    });
  });

  // Create buttons
  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`verify_pass_${data.attemptId}`)
        .setLabel('✅ قبول')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`verify_fail_${data.attemptId}`)
        .setLabel('❌ رفض')
        .setStyle(ButtonStyle.Danger),
    );

  await channel.send({
    content: hasIntegrityIssues ? '⚠️ **تحذير: تم رصد سلوك مشبوه!**' : undefined,
    embeds: [embed],
    components: [row],
  });
}

// Handle button interactions
export async function handleButtonInteraction(client: Client, interaction: ButtonInteraction) {
  const [, action, attemptId] = interaction.customId.split('_');
  
  // Check if user has any reviewer role (supports multiple role levels)
  const member = interaction.guild?.members.cache.get(interaction.user.id);
  const reviewerRoleIds = process.env.REVIEWER_ROLE_IDS?.split(',') || [];
  
  // Also check single REVIEWER_ROLE_ID for backwards compatibility
  if (process.env.REVIEWER_ROLE_ID) {
    reviewerRoleIds.push(process.env.REVIEWER_ROLE_ID);
  }
  
  const hasReviewerRole = reviewerRoleIds.some(roleId => 
    member?.roles.cache.has(roleId.trim())
  );
  
  if (!hasReviewerRole) {
    await interaction.reply({
      content: '❌ ليس لديك صلاحية لمراجعة طلبات التحقق.',
      ephemeral: true,
    });
    return;
  }

  const decision = action === 'pass' ? 'PASSED' : 'FAILED';

  try {
    // Call web API to update verification status
    const response = await fetch(`${process.env.WEB_API_URL}/api/admin/verification`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': process.env.API_SECRET!,
      },
      body: JSON.stringify({
        attemptId,
        decision,
        notes: `تم بواسطة ${interaction.user.tag}`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update verification');
    }

    // Update the embed
    const embed = interaction.message.embeds[0];
    const updatedEmbed = EmbedBuilder.from(embed)
      .setColor(decision === 'PASSED' ? 0x10b981 : 0xef4444)
      .addFields({
        name: '📌 القرار',
        value: `${decision === 'PASSED' ? '✅ مقبول' : '❌ مرفوض'} بواسطة <@${interaction.user.id}>`,
        inline: false,
      });

    // Disable buttons
    const disabledRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`verify_pass_${attemptId}`)
          .setLabel('✅ قبول')
          .setStyle(ButtonStyle.Success)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`verify_fail_${attemptId}`)
          .setLabel('❌ رفض')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
      );

    await interaction.update({
      embeds: [updatedEmbed],
      components: [disabledRow],
    });

// تعريف الواجهة داخل الدالة (أو يمكنك وضعها في الأعلى إذا أردت)
interface VerificationAPIResponse {
  attempt?: {
    user?: {
      discordId?: string;
    };
  };
}

// استلام واستخدام البيانات من استجابة API
const rawData = await response.json();

let verificationData: VerificationAPIResponse;

// التحقق من أن rawData كائن وليس null أو غيره
if (typeof rawData === 'object' && rawData !== null) {
  verificationData = rawData as VerificationAPIResponse;
} else {
  console.warn('البيانات المستلمة من API غير صالحة (ليست كائنًا).');
  verificationData = {}; // تهيئة ككائن فارغ لتجنب الأخطاء
}

// تحديث الأدوار عبر استدعاء API منفصل
if (verificationData.attempt?.user?.discordId) {
  await fetch(`${process.env.WEB_API_URL}/api/roles/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-secret': process.env.API_SECRET!,
    },
    body: JSON.stringify({
      discordId: verificationData.attempt.user.discordId,
      decision,
    }),
  });
}

    // Log to log channel
    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID!) as TextChannel;
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor(decision === 'PASSED' ? 0x10b981 : 0xef4444)
        .setTitle('📝 سجل التحقق')
        .setDescription([
          `**المراجع:** <@${interaction.user.id}>`,
          `**القرار:** ${decision === 'PASSED' ? '✅ قبول' : '❌ رفض'}`,
          `**معرف الطلب:** ${attemptId}`,
        ].join('\n'))
        .setTimestamp();

      await logChannel.send({ embeds: [logEmbed] });
    }
  } catch (error) {
    console.error('Error handling verification decision:', error);
    await interaction.reply({
      content: '❌ حدث خطأ أثناء معالجة القرار. يرجى المحاولة مرة أخرى.',
      ephemeral: true,
    });
  }
}
