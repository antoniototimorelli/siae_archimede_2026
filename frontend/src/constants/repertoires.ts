export const REPERTOIRES = [
  { id: 'musica', label: 'Musica', emoji: '🎵' },
  { id: 'cinema', label: 'Cinema', emoji: '🎬' },
  { id: 'dor', label: 'DOR', description: 'Dramma e Opere Radiotelevisive', emoji: '🎭' },
  { id: 'lirica', label: 'Lirica', emoji: '🎤' },
  { id: 'opere_letterarie', label: 'Opere Letterarie', description: 'OLAF', emoji: '📚' },
  { id: 'arti_figurative', label: 'Arti Figurative', description: 'OLAF', emoji: '🎨' },
] as const

export type RepertoireId = (typeof REPERTOIRES)[number]['id']

export function getRepertoireLabel(id: string): string {
  return REPERTOIRES.find((r) => r.id === id)?.label ?? id
}
