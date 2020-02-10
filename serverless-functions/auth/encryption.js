const crypto = require('crypto');

module.exports = {
  encrypt: (data, masterKeyBuffer) => {
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(64);
    const key = crypto.pbkdf2Sync(masterKeyBuffer, salt, 2200, 32, 'sha512');
    const cipher = crypto.createCipher('aes-256-gcm', key, iv)

    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
  },
  decrypt: function(encryptedData, masterKeyBuffer){
    const bData = Buffer.from(encryptedData, 'base64');
    const salt = bData.slice(0, 64);
    const iv = bData.slice(64, 80);
    const tag = bData.slice(80, 96);
    const text = bData.slice(96);

    const key = crypto.pbkdf2Sync(masterKeyBuffer, salt , 2200, 32, 'sha512');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');

    return decrypted;
  }
}
