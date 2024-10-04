import fs from 'fs/promises';
import crypto from 'crypto';

async function flipRandomBitInWalFile(filePath: string = 'sqlite.db-wal'): Promise<void> {
  try {
    // Read the file
    const buffer = await fs.readFile(filePath);

    if (buffer.length === 0) {
      console.log('The WAL file is empty.');
      return;
    }

    // Generate a random byte position
    const randomBytePosition = crypto.randomInt(0, buffer.length);

    // Generate a random bit position within the byte
    const randomBitPosition = crypto.randomInt(0, 8);

    // Flip the bit
    buffer[randomBytePosition] ^= (1 << randomBitPosition);

    // Write the modified buffer back to the file
    await fs.writeFile(filePath, buffer);

    console.log(`Successfully flipped a random bit in ${filePath}`);
    console.log(`Byte position: ${randomBytePosition}, Bit position: ${randomBitPosition}`);
  } catch (error) {
    console.error('Error flipping random bit:', error);
  }
}

// Usage example
flipRandomBitInWalFile();
