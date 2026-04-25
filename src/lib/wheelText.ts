export function splitWheelLabel(label: string, maxLineLength = 12, maxLines = 2): string[] {
  const normalized = label.trim().replace(/\s+/g, ' ');

  if (normalized.length <= maxLineLength) {
    return [normalized];
  }

  const words = normalized.split(' ');
  const lines: string[] = [];

  for (const word of words) {
    const current = lines[lines.length - 1] ?? '';
    const candidate = current.length > 0 ? `${current} ${word}` : word;

    if (candidate.length <= maxLineLength && current.length > 0) {
      lines[lines.length - 1] = candidate;
      continue;
    }

    if (lines.length < maxLines) {
      lines.push(word.length > maxLineLength ? `${word.slice(0, maxLineLength - 3)}...` : word);
    } else {
      const last = lines[maxLines - 1] ?? '';
      const available = Math.max(1, maxLineLength - 3);
      lines[maxLines - 1] = `${last.slice(0, available)}...`;
      break;
    }
  }

  return lines.map((line, index) => {
    if (index === maxLines - 1 && lines.length === maxLines && normalized.length > lines.join(' ').length) {
      const available = Math.max(1, maxLineLength - 3);
      return line.length > available ? `${line.slice(0, available)}...` : line;
    }

    return line;
  });
}

export function splitWheelLabelVertical(label: string, maxChars = 12): string[] {
  const normalized = label.trim().replace(/\s+/g, ' ');

  if (normalized.length === 0) {
    return [];
  }

  const glyphs = Array.from(normalized.replace(/ /g, ''));

  if (glyphs.length <= maxChars) {
    return glyphs;
  }

  return [...glyphs.slice(0, Math.max(1, maxChars - 1)), '…'];
}
