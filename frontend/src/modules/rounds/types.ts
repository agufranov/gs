export type RoundStatus = 'cooldown' | 'started' | 'ended'

export const ROUND_STATUS_NAMES: { [k in RoundStatus]: string } = {
  cooldown: 'Cooldown',
  started: 'Активен',
  ended: 'Завершён',
}
