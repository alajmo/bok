export { exists, getExcerpt };

async function exists(filePath: string): Promise<boolean> {
  return Deno.lstat(filePath)
    .then((): boolean => true)
    .catch((): boolean => false);
}

function getExcerpt(text: string, excerptionLength: number) {
  const words = text.substring(0, excerptionLength + 1).split(' ');
  return `${words.splice(0, words.length - 1).join(' ')}...`.replace(/\*/g, '');
}
