import {
  PaletteSet,
  SameKeysAs,
  EmailSettings,
  UnlimitedClubMembersValue,
  ClubBotSettings,
} from '@caravan/buddy-reading-types';
import { isMobileDevice } from './isMobileDevice';

// Store global constants for the Web project here.

const CLUB_SIZE_MIN = 2;

export const CLUB_SIZE_MAX = 50;

export const CLUB_SIZE_NO_LIMIT_LABEL = 'None';

export const CLUB_SIZES = [CLUB_SIZE_NO_LIMIT_LABEL];

for (let i = CLUB_SIZE_MIN; i <= CLUB_SIZE_MAX; i++) {
  CLUB_SIZES.push(i.toString());
}

// If changing here, please change in globalConstantsAPI in the Web API project as well.
// Also, consider existing clubs in db which may have this value saved.
export const UNLIMITED_CLUB_MEMBERS_VALUE: UnlimitedClubMembersValue = -1;

export const DEFAULT_MEMBER_LIMIT = 24;

export const DEFAULT_CLUB_SCHED_DURATION = 3;

export const DEFAULT_CLUB_SCHED_DISC_FREQ = null;

export const REFERRAL_BADGE_KEYS = ['ref5', 'ref4', 'ref3', 'ref2', 'ref1'];

export const GLOBAL_PALETTE_SETS: PaletteSet[] = ['colour'];

export const MAX_EMAIL_LENGTH = 254;

export const EMAIL_SETTINGS_KEYS_DESCRIPTIONS: SameKeysAs<EmailSettings> = {
  reminders: 'Remind me of upcoming discussions for my clubs',
  recs: 'Recommend new clubs and users to read with',
  updates: 'Keep me posted on Caravan updates',
};

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  recs: true,
  reminders: true,
  updates: true,
};

export const DISCORD_GUILD_LINK =
  process.env.NODE_ENV === 'production'
    ? isMobileDevice()
      ? 'https://discord.gg/dAXDb9E'
      : 'https://discordapp.com/channels/592761082523680798/592761082523680806'
    : isMobileDevice()
    ? 'https://discord.gg/EhnJHz3'
    : 'https://discordapp.com/channels/589194387968491530/589194387968491532';

export const CARAVAN_BOT_NAME = 'caravan-clubs-bot';

export const CLUB_BOT_SETTINGS_KEYS_DESCRIPTIONS: SameKeysAs<
  ClubBotSettings
> = {
  intros: 'Introduce new members in chat when they join the club',
};

export const DEFAULT_CLUB_BOT_SETTINGS: ClubBotSettings = {
  intros: true,
};
