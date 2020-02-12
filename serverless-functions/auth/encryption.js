const crypto = require('crypto');
const masterkeyBuffer = Buffer.from(process.env.MASTER_KEY, 'hex');

module.exports = {
    /**
     * Encrypts text by given key
     * @param String text to encrypt
     * @param Buffer masterkeyBuffer
     * @returns String encrypted text, base64 encoded
     */
    encrypt: (text) => {
        const iv = crypto.randomBytes(16);
        const salt = crypto.randomBytes(64);
        const key = crypto.pbkdf2Sync(masterkeyBuffer, salt, 2145, 32, 'sha512');

        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    },

    /**
     * Decrypts text by given key
     * @param String base64 encoded input data
     * @param Buffer masterkeyBuffer
     * @returns String decrypted (original) text
     */
    decrypt: (encdata) => {
        const bData = Buffer.from(encdata, 'base64');
        const salt = bData.slice(0, 64);
        const iv = bData.slice(64, 80);
        const tag = bData.slice(80, 96);
        const text = bData.slice(96);
        const key = crypto.pbkdf2Sync(masterkeyBuffer, salt , 2145, 32, 'sha512');

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
        return decrypted;
    }
};